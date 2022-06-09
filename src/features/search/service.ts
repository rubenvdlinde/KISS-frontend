import { emptyPage, ServiceResult, type Paginated } from "@/services";
import type { Ref } from "vue";
export type SearchResult = {
  id: string;
  title: string;
  source: string;
  content: string;
};

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
  return {
    source,
    id,
    title,
    content,
  };
}

export function useGlobalSearch(
  parameters: Ref<{ search?: string; page?: number }>
) {
  const getUrl = () => {
    const query = parameters.value.search;
    if (!query) return "";

    return `${window.globalSearchBaseUri}?query=${query}`;
  };
  async function search(url: string): Promise<Paginated<SearchResult>> {
    if (!url) return Promise.resolve(emptyPage);

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

  return ServiceResult.fromFetcher(getUrl, search);
}
