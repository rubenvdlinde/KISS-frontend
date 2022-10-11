import type { PostcodeHuisnummer } from "@/helpers/validation";
import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";

import type { Ref } from "vue";
import type { UpdateContactgegevensParams, Klant } from "./types";

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

export function useKlanten<K extends KlantSearchField>(
  params: KlantSearchParameters<K>
) {
  function getUrl() {
    const search = params.search.value;

    if (!search?.query) return "";

    const page = params.page?.value || 1;

    const url = new URL(rootUrl);
    url.searchParams.set("extend[]", "all");
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
  const emails = obj?.embedded?.emails ?? [];
  const telefoonnummers = obj?.embedded?.telefoonnummers ?? [];
  const bsn = obj?.embedded?.subjectIdentificatie?.inpBsn;

  return {
    ...obj,
    emails,
    telefoonnummers,
    bsn,
  };
}

function searchKlanten(url: string): Promise<Paginated<Klant>> {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((j) => parsePagination(j, mapKlant));
}

export function fetchKlant(id: string) {
  return fetchLoggedIn(`${rootUrl}/${id}`)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then(mapKlant);
}

export function updateContactgegevens({
  id,
  telefoonnummers,
  emails,
}: UpdateContactgegevensParams): Promise<UpdateContactgegevensParams> {
  const url = rootUrl + "/" + id;
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((klant) => {
      delete klant.url;
      return Object.assign(klant, {
        telefoonnummers,
        emails,
      });
    })
    .then((klant) =>
      fetchLoggedIn(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(klant),
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
