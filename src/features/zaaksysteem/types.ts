export type ZaakDetails = {
  id: string;
  identificatie: string;
  toelichting: string;
  startdatum: Date;
  bronorganisatie: string;
  verantwoordelijkeOrganisatie: string;
  zaaktype: string;
  zaaktypeLabel: string;
  status: string;
  behandelaar: string;
  aanvrager: string;
  fataleDatum: Date;
  streefDatum: Date;
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
  toelichting: string;
}
