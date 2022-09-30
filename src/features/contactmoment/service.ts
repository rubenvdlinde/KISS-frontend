import { throwIfNotOk, ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services";

import type {
  Gespreksresultaat,
  ContactmomentObject,
  Contactmoment,
  ContactverzoekDetail,
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

/**
 * Contactverzoeken
 */
export const useKlantContactverzoeken = (
  params: Ref<{ id: string; page?: number }>
) => {
  return ServiceResult.fromFetcher(
    getContactverzoekenURL(params.value.id, params.value.page),
    fetchKlantContactverzoeken
  );
};

const getContactverzoekenURL = (id: string, page = 1): string => {
  const url = new URL(`${window.gatewayBaseUri}/api/klantcontactmomenten`);
  url.searchParams.set("klant.id", id);
  url.searchParams.set("page", page.toString());
  url.searchParams.set("order[contactmoment.registratiedatum]", "desc");
  url.searchParams.append("extend[]", "contactmoment.medewerker");
  url.searchParams.append("extend[]", "x-commongateway-metadata.owner");
  url.searchParams.append("extend[]", "contactmoment.todo");
  url.searchParams.append("extend[]", "all");

  return url.toString();
};

const fetchKlantContactverzoeken = (
  url: string
): Promise<Paginated<ContactverzoekDetail>> => {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((j) => parsePagination(j, mapContactverzoekDetail))
    .then((p) => {
      return p;
    });
};

const mapContactverzoekDetail = (
  rawContactverzoek: any
): ContactverzoekDetail => {
  console.log({ rawContactverzoek });
  const contactverzoek = rawContactverzoek.embedded.contactmoment;

  console.log({ contactverzoek });

  return {
    id: contactverzoek.id,
    datum: new Date(contactverzoek.startdatum),
    status: "string",
    behandelaar: "string",
    afgerond: "string",
    starttijd: "string",
    zaaknummer: "string",
    zaaktype: "string",
    aanmaker: "string",
    vraag: "string",
    notitie: "string",
  };
};
