export type ZaakDetails = {
  id: string;
  startdatum: Date;
};

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
