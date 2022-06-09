import type { Werkbericht } from "./types";
import {
  createLookupList as createLookupList,
  parseValidInt,
  ServiceResult,
  type LookupList,
  type Paginated,
  type ServiceData,
} from "@/services";
import type { Ref } from "vue";

export type UseWerkberichtenParams = {
  type?: string;
  search?: string;
  page?: number;
  pagesize?: number;
};

/**
 * Tries to parse a json object returned by the api as a Werkbericht
 * @param jsonObject a json object
 * @param getBerichtTypeNameById a function to get the name of a berichttype from it's id
 */
function parseWerkbericht(
  jsonObject: any,
  getBerichtTypeNameById: (id: number) => string | undefined
): Werkbericht {
  if (
    typeof jsonObject?.title?.rendered !== "string" ||
    typeof jsonObject?.content?.rendered !== "string" ||
    typeof jsonObject?.date !== "string"
  ) {
    throw new Error(
      "invalid werkbericht, required fields are missing. input: " +
        JSON.stringify(jsonObject)
    );
  }

  const berichtTypeId = jsonObject?.["openpub-type"]?.[0];
  const typeName =
    typeof berichtTypeId === "number" && getBerichtTypeNameById(berichtTypeId);

  return {
    title: jsonObject.title.rendered,
    content: jsonObject.content.rendered,
    date: new Date(jsonObject.date),
    type: typeName || "onbekend",
  };
}

/**
 * Fetches a lookuplist of BerichtTypes from the api
 * @param url
 */
function fetchBerichtTypes(url: string): Promise<LookupList<number, string>> {
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      if (!Array.isArray(json))
        throw new Error(
          "Invalide json, verwacht een lijst: " + JSON.stringify(json)
        );
      return json
        .filter((x) => typeof x?.id === "number" && typeof x?.name === "string")
        .map((x) => [x.id, x.name] as [number, string]);
    })
    .then(createLookupList);
}

/**
 * Returns a reactive ServiceData object promising a LookupList of berichttypes
 */
function useBerichtTypes(): ServiceData<LookupList<number, string>> {
  const url = window.openPubBaseUri + "/openpub-type";
  return ServiceResult.fromFetcher(url, fetchBerichtTypes);
}

/**
 * Returns a reactive ServiceData object promising a paginated list of Werkberichten.
 * This has a dependency on useBerichtTypes()
 * @param parameters
 */
export function useWerkberichten(
  parameters?: Ref<UseWerkberichtenParams>
): ServiceData<Paginated<Werkbericht>> {
  const typesResult = useBerichtTypes();

  function getUrl() {
    // we return a falsy value if we haven't received the berichttypes yet,
    // because we need them to look up names of berichttypes by their id.
    // a falsy value indicates to the SWRV library that it should not yet trigger a fetch
    if (typesResult.state !== "success") return "";

    const url = window.openPubBaseUri + "/kiss_openpub_pub";
    if (!parameters?.value) return url;

    const { type, search, page } = parameters.value;
    const params: [string, string][] = [];
    const typeId = type && typesResult.data.fromValueToKey(type);
    if (typeId) {
      params.push(["openpub-type", typeId.toString()]);
    }
    if (search) {
      params.push(["search", search]);
    }
    if (page) {
      params.push(["page", page.toString()]);
    }
    if (!params.length) {
      return url;
    }
    return `${url}?${new URLSearchParams(params)}`;
  }

  async function fetchBerichten(url: string): Promise<Paginated<Werkbericht>> {
    if (typesResult.state !== "success" || !url)
      throw new Error(
        "this should never happen, we already check this in the url function"
      );

    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status.toString());

    const json = await r.json();

    if (!Array.isArray(json))
      throw new Error("expected a list, input: " + JSON.stringify(json));

    const pageNumber = parameters?.value.page || 1;
    const totalPages = parseValidInt(r.headers.get("x-wp-totalpages")) || 1;

    const page = json.map((x) =>
      parseWerkbericht(x, typesResult.data.fromKeyToValue)
    );

    return {
      page,
      pageNumber,
      totalPages,
      pageSize: 15,
    };
  }

  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}
