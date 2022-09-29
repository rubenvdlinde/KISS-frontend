import { throwIfNotOk, ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services";

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
