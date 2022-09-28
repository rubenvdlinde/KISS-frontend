import {
  parsePagination,
  throwIfNotOk,
  ServiceResult,
  type Paginated,
} from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Ref } from "vue";
import type {
  ContactmomentViewModel,
  Gespreksresultaat,
  ContactmomentZaak,
  ContactmomentObject,
  Contactmoment,
} from "./types";

export const saveContactmoment = (
  data: Contactmoment
): Promise<{ id: string; url: string; gespreksId: string }> =>
  fetchLoggedIn(window.gatewayBaseUri + "/api/contactmomenten", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(throwIfNotOk)
    .then((r) => r.json());

const gespreksResultatenBaseUri =
  window.gatewayBaseUri + "/api/ref/resultaattypeomschrijvingen";

export const useGespreksResultaten = () => {
  const fetchBerichten = (url: string) =>
    fetchLoggedIn(url)
      .then((r) => {
        if (!r.ok) {
          throw new Error(
            "Er is een fout opgetreden bij het laden van de gespreksresultaten"
          );
        }
        return r.json();
      })
      .then((json) => {
        const results = json?.results;
        if (!Array.isArray(results))
          throw new Error("unexpected json result: " + JSON.stringify(json));
        return results as Array<Gespreksresultaat>;
      });

  return ServiceResult.fromFetcher(gespreksResultatenBaseUri, fetchBerichten);
};

export function useKlantContactmomenten(
  params: Ref<{ id: string; page?: number }>
) {
  const getUrl = () => {
    const id = params.value.id;
    const page = params.value.page || 1;
    if (!id) return "";

    const url = new URL(window.gatewayBaseUri + "/api/klantcontactmomenten");
    url.searchParams.set("klant.id", id);
    url.searchParams.set("page", page.toString());
    url.searchParams.set("order[contactmoment.registratiedatum]", "desc");
    url.searchParams.append("extend[]", "contactmoment.objectcontactmomenten");
    url.searchParams.append("extend[]", "contactmoment.medewerker");
    url.searchParams.append("extend[]", "x-commongateway-metadata.owner");
    url.searchParams.append("extend[]", "contactmoment.todo");

    return url.toString();
  };

  return ServiceResult.fromFetcher(getUrl, fetchKlantContactmomenten);
}

const objectcontactmomentenUrl =
  window.gatewayBaseUri + "/api/objectcontactmomenten";

export const koppelObject = (data: ContactmomentObject) =>
  fetchLoggedIn(objectcontactmomentenUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(throwIfNotOk);

const mapZaak = (json: any): ContactmomentZaak => ({
  status: json?.embedded?.status?.statustoelichting,
  zaaktype: json?.embedded?.zaaktype?.onderwerp,
  zaaknummer: json?.identificatie,
});

const fixUrl = (object: string) =>
  object.startsWith("/") ? window.gatewayBaseUri + object : object;

const fetchObject = ({
  object,
  objectType,
}: {
  object: string;
  objectType: string;
}) =>
  fetchLoggedIn(fixUrl(object))
    .then(throwIfNotOk)
    .then((or) => or.json())
    .then((oj) => ({
      ...oj,
      objectType,
    }));

function mapContactverzoek(obj: any) {
  const url = (obj?.url as string) || "";
  const todo = obj?.embedded?.todo;
  const medewerkers = todo?.attendees ?? obj?.todo?.attendees ?? [];
  const completed = todo?.completed || "";
  return {
    url: url && fixUrl(url),
    medewerkers,
    completed: completed ? new Date(completed) : undefined,
    isContactverzoek: true as const,
  };
}

const mapContactmoment = async (r: any) => {
  if (r.embedded.contactmoment?.embedded?.todo)
    return mapContactverzoek(r.embedded.contactmoment);
  const contactmoment = r.embedded.contactmoment as ContactmomentViewModel;
  contactmoment.startdatum = new Date(contactmoment.startdatum);
  contactmoment.registratiedatum = new Date(contactmoment.registratiedatum);

  const objectcontactmomenten: any[] =
    r.embedded.contactmoment?.embedded?.objectcontactmomenten ?? [];

  const zakenPromises = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "zaak")
    .map((x) => fetchObject(x).then(mapZaak));

  const contactverzoekenUrls = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "contactmomentobject")
    .map(({ object }) => fixUrl(object));

  return {
    ...contactmoment,
    zaken: await Promise.all(zakenPromises),
    contactverzoekenUrls,
    isContactverzoek: false as const,
  };
};

const fetchKlantContactmomenten = (
  url: string
): Promise<Paginated<ContactmomentViewModel>> =>
  fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((j) => parsePagination(j, mapContactmoment))
    .then((p) => {
      const page = [] as ContactmomentViewModel[];
      p.page.forEach((obj) => {
        if (obj.isContactverzoek) return;
        page.push({
          ...obj,
          contactverzoeken: p.page.filter(
            (x) =>
              x.isContactverzoek && obj.contactverzoekenUrls.includes(x.url)
          ) as any,
        });
      });
      return {
        ...p,
        page,
      };
    });

export function koppelKlant({
  klantId,
  contactmomentId,
}: {
  klantId: string;
  contactmomentId: string;
}) {
  return fetchLoggedIn(window.gatewayBaseUri + "/api/klantcontactmomenten", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      klant: klantId,
      contactmoment: contactmomentId,
      rol: "gesprekspartner",
    }),
  }).then(throwIfNotOk) as Promise<void>;
}
