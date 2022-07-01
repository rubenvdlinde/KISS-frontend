export interface Zaak {
  identificatie: string;
  id: string;
  startdatum: string;
  url: string;
  zaaktype: string;
  registratiedatum: string;
  status: string;
}

export interface ContactmomentObject {
  contactmoment: string;
  object: string;
  objectType: string;
}
