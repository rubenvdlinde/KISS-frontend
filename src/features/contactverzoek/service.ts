import type { Contactverzoek } from "./types";
import { ServiceResult } from "@/services";
import { fetchLoggedIn } from "@/services";

export function useContactverzoekService() {
  if (!window.gatewayBaseUri) {
    console.error("baseUri missing");
  }

  const url = window.gatewayBaseUri + "/api/contactmomenten";

  const post = (data: Contactverzoek) => {
    const promise = fetchLoggedIn(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((r) => {
      if (!r.ok) {
        throw new Error();
      }
      return r.json();
    });

    const state = ServiceResult.fromPromise(promise);

    const result = { state: state, promise: promise };

    return result;
  };

  return {
    post,
  };
}
