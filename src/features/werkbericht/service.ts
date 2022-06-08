import type { Werkbericht } from "./types";
import { ServiceResult, type Paginated, type ServiceData } from "@/services";
import type { Ref } from "vue";

export type WerkberichtParams = {
  type?: string;
  search?: string;
  page?: number;
  pagesize?: number;
};

function twoWayMap<K, V>(data: [K, V][]) {
  const there = new Map(data);
  const back = new Map(data.map(([k, v]) => [v, k]));
  return {
    fromKey(key: K) {
      return there.get(key);
    },
    fromVal(val: V) {
      return back.get(val);
    },
  };
}

function parse(
  o: any,
  mapType: (id: number) => string | undefined
): Werkbericht {
  if (
    typeof o?.title?.rendered !== "string" ||
    typeof o?.content?.rendered !== "string" ||
    typeof o?.date !== "string"
  ) {
    throw new Error("invalid werkbericht: " + JSON.stringify(o));
  }

  const typeId = o?.["openpub-type"]?.[0];
  const typeName = typeof typeId === "number" && mapType(typeId);

  return {
    title: o.title.rendered,
    content: o.content.rendered,
    date: new Date(o.date),
    type: typeName || "onbekend",
  };
}

function fetchTypes(url: string) {
  return fetch(url)
    .then((r) => r.json())
    .then((json) => {
      if (!Array.isArray(json)) throw new Error();
      return json
        .filter((x) => typeof x?.id === "number" && typeof x?.name === "string")
        .map((x) => [x.id, x.name] as [number, string]);
    })
    .then(twoWayMap);
}

function useTypes() {
  const url = window.openPubBaseUri + "/openpub-type";
  return ServiceResult.fromFetcher(url, fetchTypes);
}

export function useWerkberichten(
  filter?: Ref<WerkberichtParams>
): ServiceData<Paginated<Werkbericht>> {
  const typesResult = useTypes();

  function getUrl() {
    if (typesResult.state !== "success") return "";
    const url = window.openPubBaseUri + "/kiss_openpub_pub";
    if (!filter?.value) return url;
    const { type, search, page } = filter.value;
    const params: [string, string][] = [];
    const typeId = type && typesResult.data.fromVal(type);
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

    const parseArray = (arr: Array<any>) =>
      arr.map((x) => parse(x, typesResult.data.fromKey));

    const r = await fetch(url);
    if (!r.ok) throw new Error(r.status.toString());
    const json = await r.json();

    // HACK: de pagination is (tijdelijk?) van PUB afgehaald.
    // door onderstaande check ondersteunen we zowel met als zonder pagination.
    if (Array.isArray(json))
      return {
        page: parseArray(json),
        pageNumber: 1,
        totalPages: 1,
        pageSize: json.length,
      };

    const {
      results,
      page: pageNumber,
      pages: totalPages,
      limit: pageSize,
    } = json;
    const page = Array.isArray(results) ? parseArray(results) : [];
    return {
      page,
      pageSize,
      pageNumber,
      totalPages,
    };
  }

  return ServiceResult.fromFetcher(getUrl, fetchBerichten);
}
