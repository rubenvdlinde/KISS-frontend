//er is voorlopig voor gekozen om een contactverzoek op te slaan
//als een contactmoment met een geneste todo
//de meeste velden worden niet gebruikt, voor transparantie hier wel uitgecommentarieerd getoond.
//nb nog niet alle velden zitten in de api todo voor conduction

export interface Contactverzoek {
  // vorigContactmoment: string | null;
  bronorganisatie: string; //verplicht in de api
  //registratiedatum: string | null;
  // kanaal: string | null;
  // voorkeurskanaal: string | null;
  // voorkeurstaal: string | null;
  // tekst: string | null;
  // onderwerpLinks: Array<string> | null;
  // initiatiefnemer: string | null;
  // medewerker: string | null;
  // resultaat: string | null;
  // medewerkerIdentificatie: MedewerkerIdentificatie | null;

  todo: {
    naam: string;
    email: string | null;
    telefoonnummer1: string | null;
    telefoonnummer2: string | null;
    description: string;
    attendees: string;
  };
}

// export interface MedewerkerIdentificatie {
//   identificatie: string;
//   achternaam: string;
//   voorletters: string;
//   voorvoegselAchternaam: string;
// }

export interface MedewerkerOptie {
  email: string;
  naam: string;
}
