export interface Klant {
  id: string;
  klantnummer: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  telefoonnummer: string;
  emailadres: string;
}

export interface Medewerker {
  id: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  emailadres: string;
  telefoonnummer1?: string;
  telefoonnummer2?: string;
}

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
    email?: string;
    telefoonnummer1?: string;
    telefoonnummer2?: string;
    description: string;
    attendees: string;
  };
}
