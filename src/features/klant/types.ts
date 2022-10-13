export type UpdateContactgegevensParams = Pick<
  Klant,
  "id" | "telefoonnummers" | "emails"
>;

export interface Klant {
  _brand: "klant";
  id: string;
  klantnummer: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  telefoonnummers: { telefoonnummer: string }[];
  emails: { email: string }[];
  bsn?: string;
}

export interface Persoon {
  _brand: "persoon";
  bsn: string;
  postcode?: string;
  huisnummer?: string;
  geboortedatum?: Date;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
}
