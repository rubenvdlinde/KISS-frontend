import type { TaxonomyFilter, Werkbericht } from "./types";
import { ServiceResult, type ServiceData } from "@/services";
import { parseDutchDate } from "@/services";
import { ref, type Ref } from "vue";

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
  };
}

const fetchBerichten = (url: string) =>
  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(r.status.toString());
      return r.json();
    })
    .then((json) => {
      const results = json?.results;
      if (!Array.isArray(results)) return [];
      return results.map(parse);
    });

function usePub(filter?: Ref<TaxonomyFilter>) {
  const getUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URI;
    if (!filter) return url;
    const params: [string, string][] = [];
    const { audience, type, search } = filter.value;
    if (audience) {
      params.push(["taxonomies.openpubAudience.name", audience]);
    }
    if (type) {
      params.push(["taxonomies.openpubType.name", type]);
    }
    if (search) {
      params.push(["content", search]);
    }
    if (!params.length) {
      return url;
    }
    return `${url}?${new URLSearchParams(params)}`;
  };
  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}

export function useLatestNews(): ServiceData<Werkbericht[]> {
  return usePub(ref({ type: "Nieuwsbericht" }));
}

export function useLatestWorkInstructions(): ServiceData<Werkbericht[]> {
  return usePub(ref({ type: "Werkinstructie" }));
}

export function useFiltered(filter: Ref<TaxonomyFilter>) {
  return usePub(filter);
}
