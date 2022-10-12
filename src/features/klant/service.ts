import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";
import { mutate } from "swrv";

import type { Ref } from "vue";
import type { UpdateContactgegevensParams, Klant } from "./types";

const isEmail = (val: string) => val.match(/[A-Z][a-z]/i);

type KlantSearchParameters = {
  search: Ref<string>;
  page: Ref<number | undefined>;
};

const rootUrl = `${window.gatewayBaseUri}/api/klanten`;

function setExtend(url: URL) {
  url.searchParams.set("extend[]", "all");
}

export function useKlanten(params: KlantSearchParameters) {
  function getUrl() {
    const search = params.search.value;

    if (!search) return "";

    const wildcardSearch = `%${search}%`;
    const page = params.page?.value || 1;

    const url = new URL(rootUrl);
    setExtend(url);
    url.searchParams.set("order[achternaam]", "asc");
    url.searchParams.set("page", page.toString());

    if (isEmail(search)) {
      url.searchParams.set("emails.email", wildcardSearch);
    } else {
      url.searchParams.set("telefoonnummers.telefoonnummer", wildcardSearch);
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
