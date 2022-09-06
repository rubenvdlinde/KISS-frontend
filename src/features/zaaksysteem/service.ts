import { DateTime } from "luxon";
import {
  fetchLoggedIn,
  parsePagination,
  ServiceResult,
  throwIfNotOk,
  type Paginated,
  type ServiceData,
} from "@/services";
import type { Zaak } from "./types";
import type { ZaakDetails } from "./types";

function parseZaak(zaak: any): Zaak {
  const startdatum = new Date(zaak.startdatum);
  const fataleDatum = DateTime.fromJSDate(startdatum)
    .plus({
      days: parseInt(zaak.embedded.zaaktype.doorlooptijd, 10),
    })
    .toJSDate();

  const getBehandelaarName = (): string => {
    const behandelaar = zaak.embedded.rollen.find(
      (rol: any) => rol.betrokkeneType === "medewerker"
    );

    const identificatie = behandelaar?.embedded?.betrokkeneIdentificatie;

    if (!identificatie) return "Onbekend";

    const voornaam = identificatie.voornamen ?? "";
    const tussenvoegsel = identificatie.voorvoegselGeslachtsnaam ?? "";
    const achternaam = identificatie.geslachtsnaam ?? "";

    return `${voornaam} ${tussenvoegsel} ${achternaam}`;
  };

  return {
    identificatie: zaak.identificatie,
    id: zaak.id,
    startdatum,
    url: zaak.url,
    zaaktype: zaak.embedded.zaaktype.omschrijving,
    registratiedatum: startdatum,
    status: zaak.embedded.status.statustoelichting,
    fataleDatum,
    behandelaar: getBehandelaarName(),
  };
}

export function useZaaksysteemService() {
  if (!window.gatewayBaseUri) {
    console.error("gatewayBaseUri missing");
  }

  const zaaksysteemBaseUri = `${window.gatewayBaseUri}/api/zaken`;

  const findByZaak = (zaaknummer: string) => {
    const url = `${zaaksysteemBaseUri}?identificatie=${zaaknummer}&extend[]=all`;
    return fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((x) => x.json())
      .then((json) => parsePagination(json, parseZaak));
  };

  const findByBsn = (bsn: string) => {
    const getFindByBsnURL = () => {
      if (!bsn) return "";

      return `${zaaksysteemBaseUri}?rollen.betrokkeneIdentificatie.inpBsn=${bsn}&extend[]=all`;
    };

    const getZaakByBsn = (url: string): Promise<Paginated<Zaak>> =>
      fetchLoggedIn(url)
        .then(throwIfNotOk)
        .then((x) => x.json())
        .then((json) => parsePagination(json, parseZaak));

    const withoutFetcher = () => getZaakByBsn(getFindByBsnURL());

    const withFetcher = () =>
      ServiceResult.fromFetcher(getFindByBsnURL, getZaakByBsn);

    return { withoutFetcher, withFetcher };
  };

  const getZaak = (id: string): ServiceData<ZaakDetails> => {
    function get(url: string): Promise<ZaakDetails> {
      return fetchLoggedIn(url)
        .then(throwIfNotOk)
        .then((x) => x.json())
        .then((json) => {
          return { id: json.id } as ZaakDetails;
        });
    }

    return ServiceResult.fromFetcher(
      `${zaaksysteemBaseUri}/${id}?extend[]=all`,
      get
    );
  };

  return {
    findByZaak,
    findByBsn,
    getZaak,
  };
}
