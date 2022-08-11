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
