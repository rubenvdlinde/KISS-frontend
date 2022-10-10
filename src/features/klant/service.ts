import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";

import type { Ref } from "vue";
import type { UpdateContactgegevensParams, Klant } from "./types";

type Valid<T> = {
  valid: true;
  result: T;
};

type Invalid = {
  valid: false;
  error: string;
};

type QueryParam = [string, string][];

type Validated<T> = Valid<T> | Invalid;

export type ValidatedSearch = Validated<QueryParam>;

export type FieldConfig = {
  label: string;
  validate: (search: string) => ValidatedSearch;
};

export const searchFields: Readonly<Record<string, FieldConfig>> = {
  email: {
    label: "E-mailadres",
    validate: (search) => ({
      valid: true,
      result: [["emails.email", `%${search}%`]],
    }),
  },
  telefoonnummer: {
    label: "Telefoonnummer",
    validate: (search) => ({
      valid: true,
      result: [["telefoonnummers.telefoonnummer", `%${search}%`]],
    }),
  },
  bsn: {
    label: "BSN",
    validate(search) {
      if (/[0-9]{9}/.test(search)) {
        return {
          valid: true,
          result: [["subjectIdentificatie.inpBsn", search]],
        };
      }
      return {
        valid: false,
        error: "Voer een valide BSN in met negen cijfers",
      };
    },
  },
  geboortedatum: {
    label: "Geboortedatum",
    validate(search) {
      const matches =
        search
          .match(/([0-9][0-9]?)[-|/]([0-9][0-9]?)[-|/]([0-9]{4})$/)
          ?.filter(Boolean) ?? [];
      if (matches.length === 4) {
        return {
          valid: true,
          result: [
            [
              "subjectIdentificatie.geboortedatum",
              `${matches[3]}-${matches[2].padStart(
                2,
                "0"
              )}-${matches[1].padStart(2, "0")}`,
            ],
          ],
        };
      }
      return {
        valid: false,
        error:
          "Voer een valide geboortedatum in volgens het patroon 23-12-1900",
      };
    },
  },
  postcodeHuisnummer: {
    label: "Postcode + huisnummer",
    validate(search) {
      const matches =
        search
          .match(/([1-9][0-9]{3}).*([A-Z]{2}).*([0-9]+)/)
          ?.filter(Boolean) ?? [];
      if (matches.length === 4) {
        return {
          valid: true,
          result: [
            [
              "subjectIdentificatie.verblijfsadres.aoaPostcode",
              matches[1] + matches[2],
            ],
            ["subjectIdentificatie.verblijfsadres.aoaHuisnummer", matches[3]],
          ],
        };
      }
      return {
        valid: false,
        error: "Voer een valide postcode en huisnummer in",
      };
    },
  },
};

export type SearchFieldKey = keyof typeof searchFields;

type KlantSearchParameters = {
  search: Ref<ValidatedSearch | undefined>;
  page: Ref<number | undefined>;
};

const rootUrl = `${window.gatewayBaseUri}/api/klanten`;

export function useKlanten(params: KlantSearchParameters) {
  function getUrl() {
    const search = params.search.value;

    if (!search?.valid) return "";

    const page = params.page?.value || 1;

    const url = new URL(rootUrl);
    url.searchParams.set("extend[]", "all");
    url.searchParams.set("order[achternaam]", "asc");
    url.searchParams.set("page", page.toString());

    search.result.forEach((param) => {
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
