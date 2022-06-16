import { parseValidUrl, ServiceResult, type Paginated } from "@/services";
import type { Ref } from "vue";
import type { SearchResult } from "./types";

function mapSource(engine: unknown) {
  if (typeof engine !== "string") return "onbekend";
  if (engine.endsWith("-crawler")) return "Website";
  if (engine === "pdc") return "Kennisbank";
  return "onbekend";
}

function mapResult(obj: any): SearchResult {
  const source = mapSource(obj?._meta?.engine);
  const id = obj?.id?.raw;
  const title = obj?.headings?.raw?.[0] ?? obj?.title?.raw;
  const content = obj?.body_content?.raw;
  const url = parseValidUrl(obj?.url?.raw);
  return {
    source,
    id,
    title,
    content,
    url,
  };
}

export function useGlobalSearch(
  parameters: Ref<{ search?: string; page?: number }>
) {
  function getUrl() {
    const query = parameters.value.search;
    if (!query) return "";

    return `${window.globalSearchBaseUri}?query=${query}`;
  }

  async function fetcher(url: string): Promise<Paginated<SearchResult>> {
    if (!url) throw new Error();
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
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
