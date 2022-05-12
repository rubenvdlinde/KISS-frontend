import type Werkbericht from "@/types/werk-bericht";
import { ServiceResult } from "./service-result";

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
    date: new Date(o.date),
  };
}

export function useLatestNews() {
  const promise: Promise<Werkbericht[]> = fetch("http://localhost/api/nieuws")
    .then((r) => r.json())
    .then((json) => {
      const results = json?.results;
      if (!Array.isArray(results)) return [];
      return results.map(parse);
    });
  return ServiceResult.fromPromise(promise);
}
