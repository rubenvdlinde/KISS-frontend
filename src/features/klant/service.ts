import {
  ServiceResult,
  fetchLoggedIn,
  type Paginated,
  parsePagination,
  throwIfNotOk,
} from "@/services";

import type { Ref } from "vue";
import type { Klant, NieuweKlant } from "@/stores/contactmoment";

const isEmail = (val: string) =>
  val.match(
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  );

type KlantSearchParameters = {
  search: Ref<string>;
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
    url.searchParams.set("page", page.toString());

    if (isEmail(search)) {
      url.searchParams.set("emailadres", search);
    } else {
      url.searchParams.set("telefoonnummer", search);
    }
    return url.toString();
  }

  return ServiceResult.fromFetcher(getUrl, searchKlanten);
}

export function createKlant(klant: NieuweKlant) {
  return fetchLoggedIn(rootUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...klant,
      bronorganisatie: window.organisatieIds[0],
      websiteUrl: location.host,
      // TODO: WAT MOET HIER IN KOMEN?
      klantnummer: "123",
    }),
  })
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then(mapKlant);
}

function mapKlant(obj: any): Klant {
  return obj;
}

function searchKlanten(url: string): Promise<Paginated<Klant>> {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((j) => parsePagination(j, mapKlant));
}
