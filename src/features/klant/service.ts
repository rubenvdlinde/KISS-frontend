import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";

import type { Ref } from "vue";
import type { UpdateContactgegevensParams, Klant } from "./types";

const searchFields = {
  email: "emails.email",
  telefoonnummer: "telefoonnummers.telefoonnummer",
  bsn: "subjectIdentificatie.inpBsn",
  geboortedatum: "subjectIdentificatie.geboortedatum",
  achternaam: "achternaam",
  postcodeHuisnummer: [
    "subjectIdentificatie.verblijfsadres.aoaPostcode",
    "subjectIdentificatie.verblijfsadres.aoaHuisnummer",
  ],
} as const;

export type SearchFields = keyof typeof searchFields;

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

    if (params.field.value === "postcodeHuisnummer") {
      const regex = /([A-Z|0-9])+/g;
      const matches = search.match(regex);
      if (matches?.length != 2) return "";
      matches.forEach((val, idx) => {
        url.searchParams.set(searchFields.postcodeHuisnummer[idx], `%${val}%`);
      });
    } else {
      const wildcardSearch = `%${search}%`;
      const field = searchFields[params.field.value];
      url.searchParams.set(field, wildcardSearch);
    }

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
