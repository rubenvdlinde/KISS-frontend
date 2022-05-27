export interface MedewerkerIdentificatie {
  identificatie: string;
  achternaam: string;
  voorletters: string;
  voorvoegselAchternaam: string;
}

export interface Contactmoment {
  vorigContactmoment: string;
  bronorganisatie: string;
  registratiedatum: Date;
  kanaal: string;
  voorkeurskanaal: string;
  voorkeurstaal: string;
  tekst: string;
  onderwerpLinks: Array<string>;
  initiatiefnemer: string;
  medewerker: string;
  medewerkerIdentificatie: MedewerkerIdentificatie;
}
