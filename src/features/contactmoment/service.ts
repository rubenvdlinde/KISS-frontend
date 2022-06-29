import { ServiceResult } from "@/services";
import type {
  Contactmoment,
  Gespreksresultaat,
  ContactmomentObject,
} from "./types";

export function useContactmomentService() {
  if (!window.contactmomentenBaseUri) {
    console.error("contactmomentenBaseUri missing");
  }

  if (!window.gespreksResultatenBaseUri) {
    console.error("gespreksResultatenBaseUri missing");
  }

  const contactmomentenUrl = window.contactmomentenBaseUri + "/contactmomenten";
  const objectcontactmomentenUrl =
    window.contactmomentenBaseUri + "/objectcontactmomenten";
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

  //   {
  //     "contactmoment": "http://kissdevelopment-dimpact.commonground.nu/api/contactmomenten/10ec6633-aa70-4d52-9e54-f7cf4c70b680",
  //     "object": "http://kissdevelopment-dimpact.commonground.nu/api/zaken/4cad808a-6011-4d07-b0c6-cd5c98a3dfae",
  //     "objectType": "zaak"
  // }

  const saveZaak = (data: ContactmomentObject) => {
    return fetch(objectcontactmomentenUrl, {
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
    saveZaak,
  };
}
