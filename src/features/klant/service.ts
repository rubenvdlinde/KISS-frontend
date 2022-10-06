import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";

import type { Ref } from "vue";
import type { UpdateContactgegevensParams, Klant } from "./types";

export type SearchFields =
  | "email"
  | "telefoonnummer"
  | "bsn"
  | "geboortedatum"
  | "achternaam"
  | "postcodeHuisnummer";

const searchFields: {
  [K in SearchFields]: (search: string) => [string, string][];
} = {
  email: (search) => [["emails.email", `%${search}%`]],
  telefoonnummer: (search) => [
    ["telefoonnummers.telefoonnummer", `%${search}%`],
  ],
  bsn: (search) => [["subjectIdentificatie.inpBsn", search]],
  geboortedatum: (search) => [["subjectIdentificatie.geboortedatum", search]],
  achternaam: (search) => [["achternaam", `%${search}%`]],
  postcodeHuisnummer(search) {
    const matches = search.match(/([A-Z|0-9])+/g);
    if (matches?.length != 2) {
      throw new Error();
    }
    const [postcode, huisnummer] = matches;
    return [
      ["subjectIdentificatie.verblijfsadres.aoaPostcode", postcode],
      ["subjectIdentificatie.verblijfsadres.aoaHuisnummer", huisnummer],
    ];
  },
};

type KlantSearchParameters = {
  search: Ref<string>;
  field: Ref<SearchFields>;
  page: Ref<number | undefined>;
};

const rootUrl = `${window.gatewayBaseUri}/api/klanten`;

export function useKlanten(params: KlantSearchParameters) {
  function getUrl() {
    const search = params.search.value;

    if (!search) return "";

    const page = params.page?.value || 1;

    const url = new URL(rootUrl);
    url.searchParams.set("extend[]", "all");
    url.searchParams.set("order[achternaam]", "asc");
    url.searchParams.set("page", page.toString());

    const searchParams = searchFields[params.field.value](search);

    searchParams.forEach((param) => {
      url.searchParams.set(...param);
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
