export interface Klant {
  id: string;
  klantnummer: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  telefoonnummers: { telefoonnummer: string }[];
  emails: { email: string }[];
  bsn?: string;
}

export type NieuweKlant = Pick<
  Klant,
  | "voornaam"
  | "voorvoegselAchternaam"
  | "achternaam"
  | "telefoonnummers"
  | "emails"
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

export interface Zaak {
  identificatie: string;
  id: string;
  startdatum: Date;
  url: string;
  zaaktype: string;
  registratiedatum: Date;
  status: string;
  fataleDatum: Date;
  behandelaar: string;
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
