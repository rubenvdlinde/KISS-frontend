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
        return json.results.map(
          (x: {
            id: string;
            identificatie: string;
            startdatum: string;
            url: string;
            embedded: {
              zaaktype: { omschrijving: string };
              status: { statustoelichting: string };
            };
          }) => {
            return {
              identificatie: x.identificatie,
              id: x.id,
              startdatum: x.startdatum,
              url: x.url,
              zaaktype: x.embedded.zaaktype.omschrijving,
              registratiedatum: x.startdatum,
              status: x.embedded.status.statustoelichting,
            } as Zaak;
          }
        );
      });
  };

  const findByBsn = (bsn: number) => {
    const url = `${window.zaaksysteemBaseUri}?rollen__betrokkeneIdentificatie__inpBsn=${bsn}&extend[]=all`;

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

        return json.results.map(
          (x: {
            id: string;
            identificatie: string;
            startdatum: string;
            url: string;
            embedded: {
              zaaktype: { omschrijving: string };
              status: { statustoelichting: string };
            };
          }) => {
            return {
              identificatie: x.identificatie,
              id: x.id,
              startdatum: x.startdatum,
              url: x.url,
              zaaktype: x.embedded.zaaktype.omschrijving,
              registratiedatum: x.startdatum,
              status: x.embedded.status.statustoelichting,
            } as Zaak;
          }
        );
      });
  };

  return {
    findByZaak,
    findByBsn,
  };
}
