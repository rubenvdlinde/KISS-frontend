import type { Werkbericht } from "./types";
import { ServiceResult, type Paginated, type ServiceData } from "@/services";
import { parseDutchDate } from "@/services";
import type { Ref } from "vue";

export type WerkberichtParams = {
  audience?: string;
  type?: string;
  search?: string;
  page?: number;
  pagesize?: number;
};

function parse(o: any): Werkbericht {
  if (
    typeof o?.title !== "string" ||
    typeof o?.content !== "string" ||
    typeof o?.date !== "string"
  ) {
    throw new Error("invalid werkbericht: " + JSON.stringify(o));
  }

  return {
    title: o.title,
    content: o.content,
    date: parseDutchDate(o.date),
    type: o?.taxonomies?.openpubType?.[0]?.name,
  };
}

function fetchBerichten(url: string): Promise<Paginated<Werkbericht>> {
  return fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(r.status.toString());
      return r.json();
    })
    .then((json) => {
      const {
        results,
        page: pageNumber,
        pages: totalPages,
        limit: pageSize,
      } = json;

      const page = Array.isArray(results) ? results.map(parse) : [];

      return {
        page,
        pageSize,
        pageNumber,
        totalPages,
      };
    });
}
export function useWerkberichten(
  filter?: Ref<WerkberichtParams>
): ServiceData<Paginated<Werkbericht>> {
  const getUrl = () => {
    const url = window.openPubBaseUri;
    if (!filter?.value) return url;
    const { audience, type, search, page } = filter.value;
    const params: [string, string][] = [];
    if (audience) {
      params.push(["taxonomies.openpubAudience.name", audience]);
    }
    if (type) {
      params.push(["taxonomies.openpubType.name", type]);
    }
    if (search) {
      params.push(["content", search]);
    }
    if (page) {
      params.push(["page", page.toString()]);
    }
    if (!params.length) {
      return url;
    }
    return `${url}?${new URLSearchParams(params)}`;
  };
  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}
