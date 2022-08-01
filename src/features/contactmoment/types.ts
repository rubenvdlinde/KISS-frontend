export interface MedewerkerIdentificatie {
  identificatie: string;
  achternaam: string;
  voorletters: string;
  voorvoegselAchternaam: string;
}

export interface Contactmoment {
  vorigContactmoment: string | null;
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
  medewerkerIdentificatie: MedewerkerIdentificatie | null;
}

export interface ContactmomentViewModel extends Contactmoment {
  id: string;
  url: string;
  startdatum: Date;
  zaken: { status: string; zaaktype: string; zaaknummer: string }[];
}

export interface Gespreksresultaat {
  id: string;
  definitie: string;
}
