import type { WerkberichtFilter, Werkbericht } from "./types";
import { ServiceResult, type ServiceData } from "@/services";
import { parseDutchDate } from "@/services";
import type { Ref } from "vue";

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
export function useWerkberichten(
  filter?: Ref<WerkberichtFilter>
): ServiceData<Werkbericht[]> {
  const getUrl = () => {
    const url = import.meta.env.VITE_API_BASE_URI;
    if (!filter?.value) return url;
    const { audience, type, search } = filter.value;
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
    if (!params.length) {
      return url;
    }
    return `${url}?${new URLSearchParams(params)}`;
  };
  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}
