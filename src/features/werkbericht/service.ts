import type { TaxonomyFilter, Werkbericht } from "./types";
import { ServiceResult, type ServiceData } from "@/services";
import { parseDutchDate } from "@/services";

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
      if (!Array.isArray(results))
        throw new Error("unexpected json result: " + JSON.stringify(json));
      return results.map(parse);
    });

function usePub(...filters: TaxonomyFilter[]) {
  let url = import.meta.env.VITE_API_BASE_URI;
  if (filters.length) {
    const params = new URLSearchParams(
      filters.map((x) =>
        "type" in x
          ? ["taxonomies.openpubType.name", x.type]
          : ["taxonomies.openpubAudience", x.audience]
      )
    );
    url = `${url}?${params}`;
  }
  return ServiceResult.fromFetcher(url, fetchBerichten);
}

export function useLatestNews(): ServiceData<Werkbericht[]> {
  return usePub({ type: "Nieuwsbericht" });
}

export function useLatestWorkInstructions(): ServiceData<Werkbericht[]> {
  return usePub({ type: "Werkinstructie" });
}
