import type { Zaak } from "./types";

export function useZaaksysteemService() {
  //todo
  //window.zaaksysteemBaseUri = "/api/zaaksysteem/";

  if (!window.zaaksysteemBaseUri) {
    console.error("zaaksysteemBaseUri missing");
  }

  const findByZaak = (zaaknummer: number) => {
    const url = `${window.zaaksysteemBaseUri}?identificatie=${zaaknummer}&extend[]=all`;

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

  const findByBsn = (bsn: number) => {
    // const url = `${window.zaaksysteemBaseUri}?rollen.betrokkeneIdentificatie.inpBsn=${bsn}&extend[]=zaaktype`;
    const url = `${window.zaaksysteemBaseUri}?rollen__betrokkeneIdentificatie__inpBsn=${bsn}&extend[]=all`;

    //todo embedde zaaktype ...
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
    findByZaak,
    findByBsn,
  };
}
