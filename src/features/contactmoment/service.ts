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
    url.searchParams.append("fields[]", "contactmoment");

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

const fetchObject = ({
  object,
  objectType,
}: {
  object: string;
  objectType: string;
}) =>
  fetchLoggedIn(
    object.startsWith("/") ? window.gatewayBaseUri + object : object
  )
    .then(throwIfNotOk)
    .then((or) => or.json())
    .then((oj) => ({
      ...oj,
      objectType,
    }));

const fetchObjecten = (c: any) => {
  const objectcontactmomenten = c?.embedded?.objectcontactmomenten;
  return Array.isArray(objectcontactmomenten)
    ? Promise.all(objectcontactmomenten.map(fetchObject))
    : Promise.resolve([]);
};

function mapContactverzoek(obj: any) {
  const todo = obj?.embedded?.todo;
  const medewerkers = todo?.attendees ?? obj?.todo?.attendees ?? [];
  const completed = todo?.completed || "";
  return {
    medewerkers,
    completed: completed ? new Date(completed) : undefined,
  };
}

const mapContactmoment = async (r: any): Promise<ContactmomentViewModel> => {
  const contactmoment = r.embedded.contactmoment as ContactmomentViewModel;
  contactmoment.startdatum = new Date(contactmoment.startdatum);
  contactmoment.registratiedatum = new Date(contactmoment.registratiedatum);

  const objecten = await fetchObjecten(contactmoment);
  const zaken = objecten.filter((x) => x.objectType === "zaak").map(mapZaak);
  const contactverzoeken = objecten
    .filter((x) => x.objectType === "contactmomentobject")
    .flatMap(mapContactverzoek);

  return {
    ...contactmoment,
    zaken,
    contactverzoeken,
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
      const page = p.page.filter((x) => !(x as any)?.embedded?.todo);
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
