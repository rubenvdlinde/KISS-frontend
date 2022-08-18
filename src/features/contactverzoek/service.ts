import { fetchLoggedIn, getFormattedUtcDate, throwIfNotOk } from "@/services";
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
