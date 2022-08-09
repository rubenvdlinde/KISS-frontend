import type { Contactverzoek } from "./types";
import { ServiceResult, fetchLoggedIn, throwIfNotOk } from "@/services";

export function usePostContactverzoek(data: Contactverzoek) {
  const url = window.gatewayBaseUri + "/api/contactmomenten";

  const promise = fetchLoggedIn(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then(throwIfNotOk) as Promise<void>;

  return ServiceResult.fromPromise(promise);
}
