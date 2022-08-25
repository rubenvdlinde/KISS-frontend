import { fetchLoggedIn, getFormattedUtcDate, throwIfNotOk } from "@/services";
import type { NieuweKlant } from "@/stores/contactmoment";
//er is voorlopig voor gekozen om een contactverzoek op te slaan
//als een contactmoment met een geneste todo
//de meeste velden worden niet gebruikt, voor transparantie hier wel uitgecommentarieerd getoond.
//nb nog niet alle velden zitten in de api todo voor conduction
// export interface MedewerkerIdentificatie {
//   identificatie: string;
//   achternaam: string;
//   voorletters: string;
//   voorvoegselAchternaam: string;
// }
export interface Contactverzoek {
  bronorganisatie: string; //verplicht in de api
  todo: {
    name: string;
    description: string;
    attendees: string[];
  };
}

export function saveContactverzoek(data: Contactverzoek) {
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
      registratiedatum,
    }),
  })
    .then(throwIfNotOk)
    .then((r) => r.json() as Promise<{ id: string; url: string }>);
}

export function createKlant(klant: NieuweKlant) {
  const url = `${window.gatewayBaseUri}/api/klanten`;
  return fetchLoggedIn(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      ...klant,
      bronorganisatie: window.organisatieIds[0],
      //websiteUrl: location.host,
      // TODO: WAT MOET HIER IN KOMEN?
      klantnummer: "123",
    }),
  })
    .then(throwIfNotOk)
    .then((r) => r.json() as Promise<{ id: string }>);
}
