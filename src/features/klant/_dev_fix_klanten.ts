import { fetchLoggedIn, throwIfNotOk, parseJson } from "@/services";
import { KlantType } from "./types";

const klantRootUrl = `${window.gatewayBaseUri}/api/klanten`;

function getAllKlantUrl() {
  const url = new URL(klantRootUrl);
  url.searchParams.set("limit", "999");
  url.searchParams.append("fields[]", "klantnummer");
  url.searchParams.append("fields[]", "bronorganisatie");
  url.searchParams.append("subjectType", "IS NULL");
  return url.toString();
}

function fixPersoonAanduiding({
  id,
  klantnummer,
  bronorganisatie,
}: {
  id: string;
  klantnummer: string;
  bronorganisatie: string;
}): Promise<Response> {
  const url = klantRootUrl + "/" + id;
  return fetchLoggedIn(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      klantnummer,
      bronorganisatie,
      subjectType: KlantType.Persoon,
    }),
  });
}

export function fixAllPersoonAanduiding() {
  return fetchLoggedIn(getAllKlantUrl())
    .then(throwIfNotOk)
    .then(parseJson)
    .then((json) => Promise.all(json?.results?.map(fixPersoonAanduiding)));
}
