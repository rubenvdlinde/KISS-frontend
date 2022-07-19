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
import { fetchLoggedIn } from "@/services";

export type UseWerkberichtenParams = {
  typeId?: number;
  search?: string;
  skillIds?: number[];
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
  getBerichtTypeNameById: (id: number) => string | undefined,
  getSkillNameById: (id: number) => string | undefined
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

  const berichtTypeIds = jsonObject?.["openpub-type"];
  const typeNames = Array.isArray(berichtTypeIds)
    ? berichtTypeIds.map(
        (x) =>
          (typeof x === "number" && getBerichtTypeNameById(x)) || "onbekend"
      )
    : ["onbekend"];

  const skillIds = jsonObject?.["openpub_skill"];
  const skillNames = Array.isArray(skillIds)
    ? skillIds.map(
        (x) => (typeof x === "number" && getSkillNameById(x)) || "onbekend"
      )
    : ["onbekend"];

  return {
    title: jsonObject.title.rendered,
    content: jsonObject.content.rendered,
    date: new Date(jsonObject.date),
    types: typeNames,
    skills: skillNames,
  };
}

/**
 * Fetches a lookuplist from the api
 * @param url
 */
function fetchLookupList(url: string): Promise<LookupList<number, string>> {
  return fetchLoggedIn(url)
    .then((r) => r.json())
    .then((json) => {
      if (!Array.isArray(json))
        throw new Error(
          "Invalide json, verwacht een lijst: " + JSON.stringify(json)
        );
      return json
        .filter((x) => typeof x?.id === "number" && typeof x?.slug === "string")
        .map((x) => [x.id, x.slug] as [number, string]);
    })
    .then(createLookupList);
}

/**
 * Returns a reactive ServiceData object promising a LookupList of berichttypes
 */
export function useBerichtTypes(): ServiceData<LookupList<number, string>> {
  const url = window.gatewayBaseUri + "/api/openpub/openpub-type";
  return ServiceResult.fromFetcher(url, fetchLookupList);
}

/**
 * Returns a reactive ServiceData object promising a LookupList of skills
 */
export function useSkills(): ServiceData<LookupList<number, string>> {
  const url = window.gatewayBaseUri + "/api/openpub/openpub_skill";
  return ServiceResult.fromFetcher(url, fetchLookupList);
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
  const skillsResult = useSkills();

  function getUrl() {
    // we return a falsy value if we haven't received the berichttypes yet,
    // because we need them to look up names of berichttypes by their id.
    // a falsy value indicates to the SWRV library that it should not yet trigger a fetch
    if (typesResult.state !== "success" || skillsResult.state !== "success")
      return "";

    const url = window.gatewayBaseUri + "/api/openpub/kiss_openpub_pub";
    if (!parameters?.value) return url;

    const { typeId, search, page, skillIds } = parameters.value;
    const params: [string, string][] = [];
    if (typeId) {
      params.push(["openpub-type", typeId.toString()]);
    }
    if (search) {
      params.push(["search", search]);
    }
    if (page) {
      params.push(["page", page.toString()]);
    }
    if (skillIds?.length) {
      params.push(["openpub_skill", skillIds.join(",")]);
    }
    if (!params.length) {
      return url;
    }
    return `${url}?${new URLSearchParams(params)}`;
  }

  async function fetchBerichten(url: string): Promise<Paginated<Werkbericht>> {
    if (
      typesResult.state !== "success" ||
      skillsResult.state !== "success" ||
      !url
    )
      throw new Error(
        "this should never happen, we already check this in the url function"
      );

    const r = await fetchLoggedIn(url);
    if (!r.ok) throw new Error(r.status.toString());

    const json = await r.json();

    if (!Array.isArray(json))
      throw new Error("expected a list, input: " + JSON.stringify(json));

    const pageNumber = parameters?.value.page || 1;
    const totalPages = parseValidInt(r.headers.get("x-wp-totalpages")) || 1;
    const totalRecords = parseValidInt(r.headers.get("x-wp-total"));

    const page = json.map((x) =>
      parseWerkbericht(
        x,
        typesResult.data.fromKeyToValue,
        skillsResult.data.fromKeyToValue
      )
    );

    return {
      page,
      pageNumber,
      totalPages,
      totalRecords,
      pageSize: 15,
    };
  }

  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}
