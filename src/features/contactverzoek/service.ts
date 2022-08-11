import { fetchLoggedIn, getFormattedUtcDate, throwIfNotOk } from "@/services";
import type { Contactverzoek } from "@/stores/contactmoment";

export function saveContactverzoek(data: Contactverzoek, description: string) {
  const url = window.gatewayBaseUri + "/api/contactmomenten";
  const registratiedatum = getFormattedUtcDate();

  return fetchLoggedIn(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      todo: {
        ...data.todo,
        description,
      },
      registratiedatum,
    }),
  })
    .then(throwIfNotOk)
    .then((r) => r.json() as Promise<{ id: string; url: string }>);
}
