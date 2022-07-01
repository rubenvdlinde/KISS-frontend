import { ServiceResult } from "@/services";
import type { Contactmoment, Gespreksresultaat } from "./types";

export function useContactmomentService() {
  if (!window.contactmomentenBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  if (!window.gespreksResultatenBaseUri) {
    console.error("gespreksResultatenBaseUri missing");
  }

  const contactmomentenUrl = window.contactmomentenBaseUri + "/contactmomenten";

  const gespreksResultatenBaseUri = window.gespreksResultatenBaseUri;

  const save = (data: Contactmoment) => {
    return fetch(contactmomentenUrl, {
      method: "POST",
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
    const fetchBerichten = fetch(gespreksResultatenBaseUri)
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
