import {
  fetchLoggedIn,
  parsePagination,
  ServiceResult,
  throwIfNotOk,
} from "@/services";
import type { Link } from "./types";

const linksUrl = (function () {
  const url = new URL(window.gatewayBaseUri + "/api/kiss/links");
  //   url.searchParams.set("order[category]", "asc");
  return url.toString();
})();

function mapLink(json: any): Link {
  const { id, url, title, category } = json ?? {};
  return {
    id,
    url,
    title,
    category,
  };
}

function fetchLinks(url: string) {
  return fetchLoggedIn(url)
    .then(throwIfNotOk)
    .then((r) => r.json())
    .then((json) => parsePagination(json, mapLink));
}

async function fetchAllLinks(url: string) {
  const first = await fetchLinks(url);
  if (first.totalPages < 2) return first.page;

  const promises = Array.from(
    { length: first.totalPages - 1 },
    (_, k) => k + 2
  ).map((no) => {
    const newUrl = new URL(url);
    newUrl.searchParams.set("page", no.toString());
    return fetchLinks(newUrl.toString());
  });

  const rest = await Promise.all(promises);
  return [...first.page, ...rest.flatMap((r) => r.page)];
}

function fetchGrouped(url: string) {
  return fetchAllLinks(url).then((results) => {
    const map = new Map<string, Link[]>();
    for (const link of results) {
      let group = map.get(link.category);
      if (!group) {
        group = [];
        map.set(link.category, group);
      }
      group.push(link);
    }
    return [...map.entries()] as const;
  });
}

export function useLinks() {
  return ServiceResult.fromFetcher(linksUrl, fetchGrouped);
}
