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

type QueryDictionary = {
  [K in KlantSearchField]: (search: FieldParams[K]) => QueryParam;
};

const queryDictionary: QueryDictionary = {
  email: (search) => [["emails.email", `%${search}%`]],
  telefoonnummer: (search) => [
    ["telefoonnummers.telefoonnummer", `%${search}%`],
  ],
  bsn: (search) => [["subjectIdentificatie.inpBsn", search]],
  geboortedatum: (search) => [
    [
      "subjectIdentificatie.geboortedatum",
      search.toISOString().substring(0, 10),
    ],
  ],
  postcodeHuisnummer: ({ postcode, huisnummer }) => [
    [
      "subjectIdentificatie.verblijfsadres.aoaPostcode",
      postcode.numbers + postcode.digits,
    ],

    ["subjectIdentificatie.verblijfsadres.aoaHuisnummer", huisnummer],
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

const rootUrl = `${window.gatewayBaseUri}/api/klanten`;

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

    const url = new URL(rootUrl);
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
        mutate(getKlantUrl(klant.id), klant);
      });
      return p;
    });
}

function getKlantUrl(id: string) {
  const url = new URL(`${rootUrl}/${id}`);
  setExtend(url);
  return url.toString();
}

function fetchKlant(url: string) {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then(mapKlant);
}

export function useKlant(id: Ref<string>) {
  return ServiceResult.fromFetcher(() => getKlantUrl(id.value), fetchKlant);
}

function updateContactgegevens({
  id,
  telefoonnummers,
  emails,
}: UpdateContactgegevensParams): Promise<UpdateContactgegevensParams> {
  const url = rootUrl + "/" + id;
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

export function usePersoonByBsn(bsn: Ref<string>) {
  const getUrl = () => {
    if (!bsn.value) return "";
    const url = new URL(window.gatewayBaseUri + "/api/ingeschrevenpersonen");
    url.searchParams.set("burgerservicenummer", bsn.value);
    url.searchParams.set("extend[]", "all");
    return url.toString();
  };

  const fetcher = (url: string) => {
    return fetchLoggedIn(url)
      .then(throwIfNotOk)
      .then((r) => r.json())
      .then((p) =>
        parsePagination(p, (u: any) => {
          const { verblijfplaats, naam, geboorte } = u?.embedded ?? {};
          const { datum } = geboorte?.embedded ?? {};
          const geboortedatum =
            datum && new Date(datum.jaar, datum.maand - 1, datum.dag);
          return {
            postcode: verblijfplaats?.postcode,
            huisnummer: verblijfplaats?.huisnummer?.toString(),
            bsn: u?.burgerservicenummer,
            geboortedatum,
            voornaam: naam?.voornamen,
            voorvoegselAchternaam: naam?.voorvoegsel,
            achternaam: naam?.geslachtsnaam,
          } as Persoon | undefined;
        })
      )
      .then((p) => {
        const result = p.page.filter(Boolean);
        if (result.length > 1) {
          throw new Error();
        }
        return result[0];
      });
  };

  return ServiceResult.fromFetcher(getUrl, fetcher);
}
