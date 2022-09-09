export type UpdateContactgegevensParams = Pick<
  Klant,
  "id" | "telefoonnummers" | "emails"
>;

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
