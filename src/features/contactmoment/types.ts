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
  startdatum: string;
  einddatum: string;
  gespreksId?: string;
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

export interface ContactverzoekDetail {
  id: string;
  datum: Date;
  status: string;
  behandelaar: string;
  afgerond: string;
  starttijd: string;
  zaaknummer: string;
  zaaktype: string;
  aanmaker: string;
  vraag: string;
  notitie: string;
}
