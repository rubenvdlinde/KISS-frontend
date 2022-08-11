import { ServiceResult, fetchLoggedIn, throwIfNotOk } from "@/services";
import type { Contactverzoek } from "@/stores/contactmoment";

export function usePostContactverzoek(
  data: Contactverzoek,
  description: string
) {
  const url = window.gatewayBaseUri + "/api/contactmomenten";

  const promise = fetchLoggedIn(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      description,
    }),
  }).then(throwIfNotOk) as Promise<void>;

  return ServiceResult.fromPromise(promise);
}
