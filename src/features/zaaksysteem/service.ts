// import { ServiceResult, type ServiceData } from "@/services";

// import type { Zaak } from "./types";

// const fetchZaken = (url: string) =>
//   fetch(url)
//     .then((r) => {
//       if (!r.ok) throw new Error(r.status.toString());
//       return r.json();
//     })
//     .then((json) => {
//       const results = json?.results;

//       if (!Array.isArray(results)) {
//         throw new Error("unexpected json result: " + JSON.stringify(json));
//       }

//       return results.map((x: unknown) => {
//         //todo....
//         return { title: (x as Zaak).title } as Zaak;
//       });
//     });

// export function useFindZaak(zaaknummer: number): ServiceData<Zaak[]> {
//   const baseUrl = "/api/zaaksysteem/"; //todo: window.zaaksysteemBaseUri;
//   const url = `${baseUrl}?zaaknummer${zaaknummer}`;

//   return ServiceResult.fromFetcher(url, fetchZaken);
// }

import { mapActions } from "pinia";
import type { Zaak } from "./types";

export function useZaaksysteemService() {
  //todo
  //window.zaaksysteemBaseUri = "/api/zaaksysteem/";

  if (!window.zaaksysteemBaseUri) {
    console.error("zaaksysteemBaseUri missing");
  }

  const find = (zaaknummer: number) => {
    const url = `${window.zaaksysteemBaseUri}?extend[]=zaaktype`;
    //const url = `${window.zaaksysteemBaseUri}?identificatie=${zaaknummer}&extend[]=zaaktype`;

    return fetch(url)
      .then((r) => {
        if (!r.ok) {
          throw new Error();
        }
        return r.json();
      })

      .then((json) => {
        if (!Array.isArray(json.results)) {
          throw new Error(
            "Invalide json, verwacht een lijst: " + JSON.stringify(json.results)
          );
        }
        return json.results.map((x: Zaak) => x as Zaak);
      });
  };
  return {
    find,
  };
}
