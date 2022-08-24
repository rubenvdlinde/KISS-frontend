import { DateTime } from "luxon";
import {
  fetchLoggedIn,
  parsePagination,
  ServiceResult,
  throwIfNotOk,
  type Paginated,
} from "@/services";
import type { Zaak } from "@/stores/contactmoment";
import type { Ref } from "vue";

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

  const findByBsn = (bsn: Ref<string | undefined>) => {
    const getFindByBsnURL = () => {
      if (!bsn.value) return "";

      return `${zaaksysteemBaseUri}?rollen__betrokkeneIdentificatie__inpBsn=${bsn.value}&extend[]=all`;
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

  return {
    findByZaak,
    findByBsn,
  };
}
