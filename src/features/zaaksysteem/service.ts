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
import type { Ref } from "vue";

type Roltype = "behandelaar" | "initiator";

const getNamePerRoltype = (zaak: any, roltype: Roltype): string => {
  const behandelaar = zaak.embedded.rollen.find(
    (rol: any) =>
      rol.betrokkeneType === "medewerker" &&
      rol.omschrijvingGeneriek === roltype
  );

  const identificatie = behandelaar?.embedded?.betrokkeneIdentificatie;

  if (!identificatie) return "Onbekend";

  const name = [
    identificatie.voornamen,
    identificatie.voorvoegselGeslachtsnaam,
    identificatie.geslachtsnaam,
  ]
    .filter((item) => item)
    .join(" ");

  return name;
};

function parseZaak(zaak: any): Zaak {
  const startdatum = new Date(zaak.startdatum);
  const fataleDatum = DateTime.fromJSDate(startdatum)
    .plus({
      days: parseInt(zaak.embedded.zaaktype.doorlooptijd, 10),
    })
    .toJSDate();

  return {
    identificatie: zaak.identificatie,
    id: zaak.id,
    startdatum,
    url: zaak.url,
    zaaktype: zaak.embedded.zaaktype.omschrijving,
    registratiedatum: startdatum,
    status: zaak.embedded.status.statustoelichting,
    fataleDatum,
    behandelaar: getNamePerRoltype(zaak, "behandelaar"),
    toelichting: zaak.toelichting,
    aanvrager: getNamePerRoltype(zaak, "initiator"),
    indienDatum: zaak.publicatiedatum ?? "Onbekend",
  };
}

const zaaksysteemBaseUri = `${window.gatewayBaseUri}/api/zaken`;

export const useZakenByBsn = (bsn: Ref<string>) => {
  const getUrl = () => {
    if (!bsn.value) return "";
    return `${zaaksysteemBaseUri}?rollen.betrokkeneIdentificatie.inpBsn=${bsn.value}&extend[]=zaaktype&extend[]=status&extend[]=rollen`;
  };

  const fetcher = (url: string): Promise<Paginated<Zaak>> =>
    fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((x) => x.json())
      .then((json) => parsePagination(json, parseZaak));

  return ServiceResult.fromFetcher(getUrl, fetcher);
};

export const useZakenByZaaknummer = (zaaknummer: Ref<string>) => {
  const getUrl = () =>
    !zaaknummer.value
      ? ""
      : `${zaaksysteemBaseUri}?identificatie=${zaaknummer.value}&extend[]=all`;

  const fetcher = (url: string) =>
    fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((x) => x.json())
      .then((json) => parsePagination(json, parseZaak));

  return ServiceResult.fromFetcher(getUrl, fetcher);
};

export const useZaakById = (id: Ref<string>): ServiceData<ZaakDetails> => {
  const getUrl = () =>
    !id.value
      ? ""
      : `${zaaksysteemBaseUri}/${id.value}?extend[]=all&extend[]=x-commongateway-metadata.self`;

  function fetcher(url: string): Promise<ZaakDetails> {
    return fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((x) => x.json())
      .then((zaak) => {
        const fataleDatum = DateTime.fromJSDate(new Date(zaak.startdatum))
          .plus({
            days: parseInt(zaak.embedded.zaaktype.doorlooptijd, 10),
          })
          .toJSDate();
        const streefDatum = DateTime.fromJSDate(new Date(zaak.startdatum))
          .plus({
            days: parseInt(zaak.embedded.zaaktype.servicenorm, 10),
          })
          .toJSDate();

        return {
          ...zaak,
          zaaktype: zaak.embedded.zaaktype.id,
          zaaktypeLabel: zaak.embedded.zaaktype.onderwerp,
          zaaktypeOmschrijving: zaak.embedded.zaaktype.omschrijving,
          status: zaak.embedded.status.statustoelichting,
          behandelaar: getNamePerRoltype(zaak, "behandelaar"),
          aanvrager: getNamePerRoltype(zaak, "initiator"),
          startdatum: zaak.startdatum,
          fataleDatum: fataleDatum,
          streefDatum: streefDatum,
          indienDatum: zaak.publicatiedatum ?? "Onbekend",
          registratieDatum: new Date(zaak.registratiedatum),
          self: zaak["x-commongateway-metadata"].self,
          documenten: mapDocumenten(zaak?.embedded?.zaakinformatieobjecten),
          omschrijving: zaak.omschrijving,
        } as ZaakDetails;
      });
  }

  return ServiceResult.fromFetcher(getUrl, fetcher);
};

export async function updateToelichting(
  zaak: ZaakDetails,
  toelichting: string
): Promise<Zaak> {
  const url = `${window.gatewayBaseUri}/api/zaken/${zaak.id}`;
  const res = await fetchLoggedIn(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bronorganisatie: zaak.bronorganisatie,
      startdatum: zaak.startdatum,
      verantwoordelijkeOrganisatie: zaak.verantwoordelijkeOrganisatie,
      zaaktype: zaak.zaaktype,
      toelichting: toelichting,
    }),
  });

  if (!res.ok)
    throw new Error(`Expected to update toelichting: ${res.status.toString()}`);

  return res.json();
}

const mapDocumenten = (rawDocumenten: any[]) => {
  if (!rawDocumenten) return [];

  return rawDocumenten.map((document) => ({
    id: document.embedded.informatieobject.id,
    titel: document.embedded.informatieobject.titel,
    bestandsomvang: document.embedded.informatieobject.bestandsomvang,
    creatiedatum: new Date(document.embedded.informatieobject.creatiedatum),
    vertrouwelijkheidaanduiding:
      document.embedded.informatieobject.vertrouwelijkheidaanduiding,
    formaat: document.embedded.informatieobject.formaat,
    inhoud: document.embedded.informatieobject.inhoud,
  }));
};
