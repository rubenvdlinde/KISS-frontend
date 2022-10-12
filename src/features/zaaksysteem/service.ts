import { DateTime } from "luxon";
import {
  fetchLoggedIn,
  parsePagination,
  ServiceResult,
  throwIfNotOk,
  type Paginated,
} from "@/services";
import type { ZaakDetails } from "./types";
import type { Ref } from "vue";
import { mutate } from "swrv";

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

const mapZaakDetails = (zaak: any) => {
  const startdatum = zaak.startdatum ? new Date(zaak.startdatum) : undefined;

  const fataleDatum =
    startdatum &&
    DateTime.fromJSDate(startdatum)
      .plus({
        days: parseInt(zaak.embedded.zaaktype.doorlooptijd, 10),
      })
      .toJSDate();

  const streefDatum =
    startdatum &&
    DateTime.fromJSDate(startdatum)
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
    startdatum,
    fataleDatum: fataleDatum,
    streefDatum: streefDatum,
    indienDatum: zaak.publicatiedatum && new Date(zaak.publicatiedatum),
    registratieDatum: zaak.registratiedatum && new Date(zaak.registratiedatum),
    self: zaak["x-commongateway-metadata"].self,
    documenten: mapDocumenten(zaak?.embedded?.zaakinformatieobjecten),
    omschrijving: zaak.omschrijving,
  } as ZaakDetails;
};

const zaaksysteemBaseUri = `${window.gatewayBaseUri}/api/zaken`;

function addExtends(url: URL) {
  url.searchParams.set("extend[]", "all");
  url.searchParams.append("extend[]", "x-commongateway-metadata.self");
}

const overviewFetcher = (url: string): Promise<Paginated<ZaakDetails>> =>
  fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((x) => x.json())
    .then((json) => parsePagination(json, mapZaakDetails))
    .then((zaken) => {
      zaken.page.forEach((zaak) => {
        mutate(getZaakUrl(zaak.id), zaak);
      });
      return zaken;
    });

export const useZakenByBsn = (bsn: Ref<string>) => {
  const getUrl = () => {
    if (!bsn.value) return "";
    const url = new URL(zaaksysteemBaseUri);
    addExtends(url);
    url.searchParams.set("rollen.betrokkeneIdentificatie.inpBsn", bsn.value);
    return url.toString();
  };

  return ServiceResult.fromFetcher(getUrl, overviewFetcher);
};

export const useZakenByZaaknummer = (zaaknummer: Ref<string>) => {
  const getUrl = () => {
    if (!zaaknummer.value) return "";
    const url = new URL(zaaksysteemBaseUri);
    addExtends(url);
    url.searchParams.set("identificatie", zaaknummer.value);
    return url.toString();
  };

  return ServiceResult.fromFetcher(getUrl, overviewFetcher);
};

const getZaakUrl = (id: string) => {
  if (!id) return "";
  const url = new URL(`${zaaksysteemBaseUri}/${id}`);
  addExtends(url);
  return url.toString();
};

export const useZaakById = (id: Ref<string>) => {
  const getUrl = () => getZaakUrl(id.value);

  function fetcher(url: string): Promise<ZaakDetails> {
    return fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((x) => x.json())
      .then(mapZaakDetails);
  }

  return ServiceResult.fromFetcher(getUrl, fetcher);
};

export async function updateToelichting(
  zaak: ZaakDetails,
  toelichting: string
): Promise<ZaakDetails> {
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
