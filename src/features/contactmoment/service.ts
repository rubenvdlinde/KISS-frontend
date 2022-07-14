import { ServiceResult } from "@/services";
import type { Contactmoment, Gespreksresultaat } from "./types";

export function useContactmomentService() {
  if (!window.gatewayBaseUri) {
    console.error("gatewayBaseUri missing");
  }

  const contactmomentenUrl = window.gatewayBaseUri + "/api/contactmomenten";

  const gespreksResultatenBaseUri =
    window.gatewayBaseUri + "/api/ref/resultaattypeomschrijvingen";

  const save = (data: Contactmoment) => {
    return fetch(contactmomentenUrl, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    });
  };

  const getGespreksResultaten = () => {
    const fetchBerichten = fetch(gespreksResultatenBaseUri, {
      credentials: "include",
    })
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

    return ServiceResult.fromPromise(fetchBerichten);
  };

  return {
    save,
    getGespreksResultaten,
    // saveZaak,
  };
}
