import type { PostcodeHuisnummer } from "@/helpers/validation";
import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
  type ServiceData,
} from "@/services";
import { computed } from "@vue/reactivity";
import useSWRV, { mutate } from "swrv";

import { watch, watchEffect, type ComputedRef, type Ref } from "vue";
import type { UpdateContactgegevensParams, Klant, Persoon } from "./types";

type QueryParam = [string, string][];

type FieldParams = {
  email: string;
  telefoonnummer: string;
  bsn: string;
  geboortedatum: Date;
  postcodeHuisnummer: PostcodeHuisnummer;
};

export function klantSearch<K extends KlantSearchField>(
  args: KlantSearch<K>
): KlantSearch<K> {
  return args;
}

export type KlantSearchField = keyof FieldParams;

type PersoonSearchField = Extract<
  KlantSearchField,
  "bsn" | "geboortedatum" | "postcodeHuisnummer"
>;

type ContactSearchField = Extract<
  KlantSearchField,
  "bsn" | "geboortedatum" | "postcodeHuisnummer"
>;

type QueryDictionary = {
  [K in KlantSearchField]: (search: FieldParams[K]) => QueryParam;
};

const queryDictionary: QueryDictionary = {
  email: (search) => [["emails.email", `%${search}%`]],
  telefoonnummer: (search) => [
    ["telefoonnummers.telefoonnummer", `%${search}%`],
  ],
  bsn: (search) => [["burgerservicenummer", search]],
  geboortedatum: (search) => [
    ["geboorte.datum.datum", search.toISOString().substring(0, 10)],
  ],
  postcodeHuisnummer: ({ postcode, huisnummer }) => [
    ["verblijfplaats.postcode", postcode.numbers + postcode.digits],

    ["verblijfplaats.huisnummer", huisnummer],
  ],
};

export type KlantSearch<K extends KlantSearchField> = {
  searchField: K;
  query: FieldParams[K];
};

function getQueryParams<K extends KlantSearchField>(params: KlantSearch<K>) {
  return queryDictionary[params.searchField](params.query as any) as ReturnType<
    QueryDictionary[K]
  >;
}

type KlantSearchParameters<K extends KlantSearchField = KlantSearchField> = {
  search: Ref<KlantSearch<K> | undefined>;
  page: Ref<number | undefined>;
};

const klantRootUrl = `${window.gatewayBaseUri}/api/klanten`;

function setExtend(url: URL) {
  url.searchParams.set("extend[]", "all");
}

function getKlantSearchUrl<K extends KlantSearchField>(
  search: KlantSearch<K> | undefined,
  page: number | undefined
) {
  if (!search?.query) return "";

  const url = new URL(klantRootUrl);
  setExtend(url);
  url.searchParams.set("order[achternaam]", "asc");
  url.searchParams.set("page", page?.toString() ?? "1");

  getQueryParams(search).forEach((tuple) => {
    url.searchParams.set(...tuple);
  });

  return url.toString();
}

function mapKlant(obj: any): Klant {
  const { subjectIdentificatie, emails, telefoonnummers } = obj?.embedded ?? {};
  const { inpBsn, verblijfsadres, geboortedatum } = subjectIdentificatie ?? {};
  const { aoaHuisnummer, aoaPostcode } = verblijfsadres ?? {};

  return {
    ...obj,
    emails: emails ?? [],
    telefoonnummers: telefoonnummers ?? [],
    bsn: inpBsn,
    postcode: aoaPostcode,
    huisnummer: aoaHuisnummer,
    geboortedatum: geboortedatum && new Date(geboortedatum),
  };
}

function searchKlanten(url: string): Promise<Paginated<Klant>> {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then(parseJson)
    .then((j) => parsePagination(j, mapKlant))
    .then((p) => {
      p.page.forEach((klant) => {
        const idUrl = getKlantIdUrl(klant.id);
        if (idUrl) {
          mutate(idUrl, klant);
        }
        const bsnUrl = getKlantBsnUrl(klant.bsn);

        if (bsnUrl) {
          mutate(bsnUrl, klant);
        }
      });
      return p;
    });
}

function getKlantIdUrl(id?: string) {
  if (!id) return "";
  const url = new URL(`${klantRootUrl}/${id}`);
  setExtend(url);
  return url.toString();
}

function getKlantBsnUrl(bsn?: string) {
  if (!bsn) return "";
  const url = new URL(klantRootUrl);
  setExtend(url);
  url.searchParams.set("subjectIdentificatie.inpBsn", bsn);
  return url.toString();
}

function fetchKlantById(url: string) {
  return fetchLoggedIn(url).then(throwIfNotOk).then(parseJson).then(mapKlant);
}

function forceOne<T>(paginated: Paginated<T>) {
  if (paginated.page.length === 0) return undefined;
  if (paginated.page.length === 1) return paginated.page[0];
  throw new Error();
}

const fetchKlantByBsn = (url: string) => searchKlanten(url).then(forceOne);

export function useKlant(id: Ref<string>) {
  return ServiceResult.fromFetcher(
    () => getKlantIdUrl(id.value),
    fetchKlantById
  );
}

async function parseJson(r: Response) {
  try {
    return await r.json();
  } catch (error) {
    console.error("json error: " + r.url);
    throw error;
  }
}

function updateContactgegevens({
  id,
  telefoonnummers,
  emails,
}: UpdateContactgegevensParams): Promise<UpdateContactgegevensParams> {
  const url = klantRootUrl + "/" + id;
  return fetchLoggedIn(url + "?fields[]=klantnummer&fields[]=bronorganisatie")
    .then(throwIfNotOk)
    .then(parseJson)
    .then(({ klantnummer, bronorganisatie }) =>
      fetchLoggedIn(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          telefoonnummers,
          emails,
          klantnummer,
          bronorganisatie,
        }),
      })
    )
    .then(throwIfNotOk)
    .then(parseJson)
    .then(({ embedded }) => ({
      id,
      telefoonnummers: embedded?.telefoonnummers ?? [],
      emails: embedded?.emails ?? [],
    }));
}

export function useUpdateContactGegevens() {
  return ServiceResult.fromSubmitter(updateContactgegevens);
}

function getPersoonUrl(bsn: string) {
  if (!bsn) return "";
  const url = new URL(window.gatewayBaseUri + "/api/ingeschrevenpersonen");
  url.searchParams.set("burgerservicenummer", bsn);
  url.searchParams.set("extend[]", "all");
  return url.toString();
}

function mapPersoon(json: any): Persoon {
  const { verblijfplaats, naam, geboorte } = json?.embedded ?? {};
  const { datum } = geboorte?.embedded ?? {};
  const geboortedatum =
    datum && new Date(datum.jaar, datum.maand - 1, datum.dag);
  return {
    postcode: verblijfplaats?.postcode,
    huisnummer: verblijfplaats?.huisnummer?.toString(),
    bsn: json?.burgerservicenummer,
    geboortedatum,
    voornaam: naam?.voornamen,
    voorvoegselAchternaam: naam?.voorvoegsel,
    achternaam: naam?.geslachtsnaam,
  };
}

function fetchPersoonByBsn(url: string) {
  return fetchPersonen(url).then(forceOne);
}

export function usePersoonByBsn(bsn: Ref<string>) {
  const getUrl = () => getPersoonUrl(bsn.value);
  return ServiceResult.fromFetcher(getUrl, fetchPersoonByBsn);
}

const fetchPersonen = (url: string) => {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then(parseJson)
    .then((p) => parsePagination(p, mapPersoon))
    .then((p) => {
      p.page.forEach((persoon) => {
        mutate(getPersoonUrl(persoon.bsn), persoon);
      });
      return p;
    });
};

const personenRootUrl = window.gatewayBaseUri + "/api/ingeschrevenpersonen";

function getPersoonSearchUrl<K extends PersoonSearchField>(
  search: KlantSearch<K> | undefined,
  page: number | undefined
) {
  if (!search) return "";
  const url = new URL(personenRootUrl);
  getQueryParams<K>(search).forEach((tuple) => {
    url.searchParams.set(...tuple);
  });
  url.searchParams.set("extend[]", "all");
  url.searchParams.set("page", page?.toString() ?? "1");
  return url.toString();
}
export type CombinedPersoonSearchResult = {
  bsn: string | undefined;
  persoon: Persoon | undefined;
  klant: Klant | undefined;
};

export type UberReturnType = ServiceData<
  Paginated<CombinedPersoonSearchResult>
>;

export function useUberSearch<K extends KlantSearchField>(
  params: KlantSearchParameters<K>
): UberReturnType {
  const getUrl = () => {
    const search = params.search.value;
    const page = params.page.value || 1;

    if (!search) return "";

    if (
      search.searchField === "telefoonnummer" ||
      search.searchField === "email"
    )
      return getKlantSearchUrl(search, page);

    return getPersoonSearchUrl(search as any, page);
  };

  const fetcher = (url: string) => {
    return url.includes(personenRootUrl)
      ? fetchPersonen(url).then((paginated) => ({
          ...paginated,
          page: paginated.page.map<CombinedPersoonSearchResult>((persoon) => ({
            persoon,
            bsn: persoon.bsn,
            klant: undefined,
          })),
        }))
      : searchKlanten(url).then((paginated) => ({
          ...paginated,
          page: paginated.page.map<CombinedPersoonSearchResult>((klant) => ({
            klant,
            bsn: klant.bsn,
            persoon: undefined,
          })),
        }));
  };

  return ServiceResult.fromFetcher(getUrl, fetcher);
}

export function useEnrichPersoon(input: Ref<CombinedPersoonSearchResult>) {
  const getUrl = () => {
    const { bsn, persoon, klant } = input.value;
    if (!bsn || (persoon && klant)) return "";
    if (persoon) return getKlantBsnUrl(bsn);
    return getPersoonUrl(bsn);
  };

  const fetcher = (
    url: string
  ): Promise<{
    persoon: Persoon | undefined;
    klant: Klant | undefined;
  }> =>
    url.includes(personenRootUrl)
      ? fetchPersoonByBsn(url).then((persoon) => ({
          persoon,
          klant: undefined,
        }))
      : fetchKlantByBsn(url).then((klant) => ({
          klant,
          persoon: undefined,
        }));

  return ServiceResult.fromFetcher(getUrl, fetcher);
}
