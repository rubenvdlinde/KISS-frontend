export interface Klant {
  id: string;
  klantnummer: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  telefoonnummer: string;
  emailadres: string;
  bsn?: number;
}

export type NieuweKlant = Pick<
  Klant,
  | "voornaam"
  | "voorvoegselAchternaam"
  | "achternaam"
  | "telefoonnummer"
  | "emailadres"
>;

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
  bronorganisatie: string; //verplicht in de api
  todo: {
    description: string;
    attendees: string;
  };
}

export interface Zaak {
  identificatie: string;
  id: string;
  startdatum: string;
  url: string;
  zaaktype: string;
  registratiedatum: string;
  status: string;
  fataleDatum: string;
}

export interface MedewerkerIdentificatie {
  identificatie: string;
  achternaam: string;
  voorletters: string;
  voorvoegselAchternaam: string;
}

export interface Contactmoment {
  vorigContactmoment: string | undefined;
  bronorganisatie: string;
  registratiedatum: string;
  kanaal: string;
  voorkeurskanaal: string;
  voorkeurstaal: string;
  tekst: string;
  onderwerpLinks: Array<string>;
  initiatiefnemer: string;
  medewerker: string;
  resultaat: string;
  medewerkerIdentificatie: MedewerkerIdentificatie | undefined;
}
