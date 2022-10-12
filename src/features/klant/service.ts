import type { PostcodeHuisnummer } from "@/helpers/validation";
import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";
import { mutate } from "swrv";

import type { Ref } from "vue";
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

export function useKlanten<K extends KlantSearchField>(
  params: KlantSearchParameters<K>
) {
  function getUrl() {
    const search = params.search.value;

    if (!search?.query) return "";

    const page = params.page?.value || 1;

    const url = new URL(klantRootUrl);
    setExtend(url);
    url.searchParams.set("order[achternaam]", "asc");
    url.searchParams.set("page", page.toString());

    getQueryParams(search).forEach((tuple) => {
      url.searchParams.set(...tuple);
    });

    return url.toString();
  }

  return ServiceResult.fromFetcher(getUrl, searchKlanten);
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
    .then((r) => r.json())
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

function fetchKlant(url: string) {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then(mapKlant);
}

export function useKlant(id: Ref<string>) {
  return ServiceResult.fromFetcher(() => getKlantIdUrl(id.value), fetchKlant);
}

function updateContactgegevens({
  id,
  telefoonnummers,
  emails,
}: UpdateContactgegevensParams): Promise<UpdateContactgegevensParams> {
  const url = klantRootUrl + "/" + id;
  return fetchLoggedIn(url + "?fields[]=klantnummer&fields[]=bronorganisatie")
    .then(throwIfNotOk)
    .then((r) => r.json())
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
    .then((x) => x.json())
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

export function usePersoonByBsn(bsn: Ref<string>) {
  const getUrl = () => getPersoonUrl(bsn.value);
  const fetcher = (url: string) =>
    fetchPersonen(url).then((paginated) => {
      if (paginated.page.length === 0) return undefined;
      if (paginated.page.length === 1) return paginated.page[0];
      throw new Error();
    });
  return ServiceResult.fromFetcher(getUrl, fetcher);
}

const fetchPersonen = (url: string) => {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((p) => parsePagination(p, mapPersoon))
    .then((p) => {
      p.page.forEach((persoon) => {
        mutate(getPersoonUrl(persoon.bsn), persoon);
      });
      return p;
    });
};

export function useSearchPersonen<K extends PersoonSearchField>(
  search: KlantSearch<K>
) {
  const getUrl = () => {
    const url = new URL(window.gatewayBaseUri + "/api/ingeschrevenpersonen");
    getQueryParams<K>(search).forEach((tuple) => {
      url.searchParams.set(...tuple);
    });
    url.searchParams.set("extend[]", "all");
    return url.toString();
  };

  return ServiceResult.fromFetcher(getUrl, fetchPersonen);
}
