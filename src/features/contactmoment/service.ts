import { throwIfNotOk, ServiceResult, type Paginated } from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Ref } from "vue";
import { resolveContactverzoekenPaginated } from "../shared/resolve-contactverzoeken";
import type { ContactmomentViewModel } from "../shared/types";
import type {
  Gespreksresultaat,
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
    url.searchParams.append("limit", "10");

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

const fetchKlantContactmomenten = (
  url: string
): Promise<Paginated<ContactmomentViewModel>> =>
  fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then(resolveContactverzoekenPaginated);

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
