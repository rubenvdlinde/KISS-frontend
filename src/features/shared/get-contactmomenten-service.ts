import {
  fetchLoggedIn,
  parsePagination,
  ServiceResult,
  throwIfNotOk,
  type Paginated,
} from "@/services";
import type { Ref } from "vue";
import type { ContactmomentZaak, ContactmomentViewModel } from "./types";

const mapZaak = (json: any): ContactmomentZaak => ({
  status: json?.embedded?.status?.statustoelichting,
  zaaktype: json?.embedded?.zaaktype?.onderwerp,
  zaaknummer: json?.identificatie,
});

const fixUrl = (object: string) =>
  object.startsWith("/") ? window.gatewayBaseUri + object : object;

const fetchObject = (
  {
    object,
  }: {
    object: string;
  },
  extendArr: string[] = []
) => {
  const url = new URL(fixUrl(object));
  for (const extend of extendArr ?? []) {
    url.searchParams.append("extend[]", extend);
  }
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((or) => or.json());
};

function mapContactverzoek(obj: any) {
  const todo = obj?.embedded?.todo;
  const medewerkers = todo?.attendees ?? obj?.todo?.attendees ?? [];
  const completed = todo?.completed || "";

  return {
    medewerkers,
    completed: completed ? new Date(completed) : undefined,
  };
}

const mapContactmoment = async (
  r: any
): Promise<ContactmomentViewModel | undefined> => {
  if (r?.todo) return undefined;
  const contactmoment = r as ContactmomentViewModel;
  contactmoment.startdatum = new Date(contactmoment.startdatum);
  contactmoment.registratiedatum = new Date(contactmoment.registratiedatum);

  const objectcontactmomenten: any[] = r?.embedded?.objectcontactmomenten ?? [];

  const zakenPromises = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "zaak")
    .map((x) => fetchObject(x).then(mapZaak));

  const contactverzoekPromises = objectcontactmomenten
    .filter(({ objectType }: any) => objectType === "contactmomentobject")
    .map((x) => fetchObject(x, ["todo"]).then(mapContactverzoek));

  return {
    ...contactmoment,
    zaken: await Promise.all(zakenPromises),
    contactverzoeken: await Promise.all(contactverzoekPromises),
  };
};

export const resolveContactverzoekenPaginated = async (
  json: unknown
): Promise<Paginated<ContactmomentViewModel>> => {
  const paginated = await parsePagination(json, (x: any) =>
    mapContactmoment(x.embedded.contactmoment)
  );
  const page = paginated.page.filter(Boolean) as ContactmomentViewModel[];

  return {
    ...paginated,
    page,
  };
};

function fetchContactmomenten(
  url: string
): Promise<Paginated<ContactmomentViewModel>> {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((x) => parsePagination(x, mapContactmoment))
    .then((paginated) => {
      const page = paginated.page.filter(Boolean) as ContactmomentViewModel[];

      return {
        ...paginated,
        page,
      };
    });
}

function getAllContactmomentenUrl(page: number) {
  const url = new URL(window.gatewayBaseUri + "/api/contactmomenten");
  url.searchParams.set("order[registratiedatum]", "desc");
  url.searchParams.append("extend[]", "medewerker");
  url.searchParams.append("extend[]", "x-commongateway-metadata.owner");
  url.searchParams.set("limit", "10");
  url.searchParams.set("page", page.toString());
  return url;
}

export function useContactmomentenByZaakUrl(
  self: Ref<string>,
  page: Ref<number>
) {
  function getUrl() {
    const url = getAllContactmomentenUrl(page.value);
    url.searchParams.set("objectcontactmomenten.object", self.value);
    return url.toString();
  }
  return ServiceResult.fromFetcher(getUrl, fetchContactmomenten);
}

export function useContactmomentenByKlantId(
  id: Ref<string>,
  page: Ref<number>
) {
  function getUrl() {
    const url = getAllContactmomentenUrl(page.value);
    url.searchParams.set("klantcontactmomenten.klant.id", id.value);
    return url.toString();
  }
  return ServiceResult.fromFetcher(getUrl, fetchContactmomenten);
}
