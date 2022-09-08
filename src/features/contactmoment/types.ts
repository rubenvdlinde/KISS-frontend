export interface ContactmomentViewModel {
  id: string;
  url: string;
  startdatum: Date;
  registratiedatum: Date;
  medewerker: string;
  kanaal: string;
  resultaat: string;
  tekst: string;
  zaken: ContactmomentZaak[];
  contactverzoeken: { medewerkers: string[]; completed?: Date }[];
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
  onderwerpLinks: string[];
  initiatiefnemer: string;
  medewerker: string;
  resultaat: string;
  medewerkerIdentificatie: MedewerkerIdentificatie | undefined;
}

export interface ContactmomentZaak {
  status: string;
  zaaktype: string;
  zaaknummer: string;
}

export interface Gespreksresultaat {
  id: string;
  definitie: string;
}

export interface ContactmomentObject {
  contactmoment: string;
  object: string;
  objectType: string;
}
