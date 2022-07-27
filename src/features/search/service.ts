import { parseValidUrl, ServiceResult, type Paginated } from "@/services";
import { fetchLoggedIn } from "@/services";
import type { Ref } from "vue";
import type { SearchResult, Source } from "./types";

function mapResult(obj: any): SearchResult {
  const source = obj?.object_bron?.raw ?? "Website";
  const id = obj?.id?.raw;
  const title = obj?.headings?.raw?.[0] ?? obj?.title?.raw;
  const content = obj?.body_content?.raw;
  const url = parseValidUrl(obj?.url?.raw);
  const jsonObject = JSON.parse(obj?.object?.raw ?? null);
  return {
    source,
    id,
    title,
    content,
    url,
    jsonObject,
  };
}

const globalSearchBaseUri =
  window.gatewayBaseUri + "/api/elastic/api/as/v1/engines/kiss-engine/search";

export function useGlobalSearch(
  parameters: Ref<{ search?: string; page?: number }>
) {
  function getUrl() {
    const query = parameters.value.search;
    if (!query) return "";

    return `${globalSearchBaseUri}?query=${query}`;
  }

  async function fetcher(url: string): Promise<Paginated<SearchResult>> {
    if (!url) throw new Error();
    const r = await fetchLoggedIn(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: parameters.value.search,
        page: {
          current: parameters.value.page || 1,
        },
      }),
    });
    if (!r.ok) throw new Error();
    const json = await r.json();
    const { results, meta } = json ?? {};
    const {
      current: pageNumber,
      total_pages: totalPages,
      size: pageSize,
    } = meta?.page ?? {};
    const page = Array.isArray(results) ? results.map(mapResult) : [];
    return {
      page,
      pageSize,
      pageNumber,
      totalPages,
    };
  }

  function getUniqueId() {
    const { search, page } = parameters.value;
    if (!search) return "";
    return `${search}|${page || 1}`;
  }

  return ServiceResult.fromFetcher(getUrl, fetcher, {
    getUniqueId,
  });
}

export function useSources() {
  async function fetcher(url: string): Promise<Source[]> {
    if (!url) throw new Error();
    const r = await fetchLoggedIn(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: "",
        facets: {
          object_bron: {
            type: "value",
          },
          domains: {
            type: "value",
          },
        },
      }),
    });
    if (!r.ok) throw new Error();
    const json = await r.json();
    const { facets } = json ?? {};

    if (typeof facets !== "object" || !facets) {
      throw new Error();
    }

    const entries = Object.entries(facets) as [
      string,
      { data: { value: string }[] }[]
    ][];

    return entries.flatMap(([k, v]) =>
      v.flatMap((x) =>
        x.data.map((x) => ({
          name: x.value,
          type: k,
        }))
      )
    );
  }

  return ServiceResult.fromFetcher(globalSearchBaseUri, fetcher);
}
