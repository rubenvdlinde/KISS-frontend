export interface Klant {
  id: string;
  klantnummer: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  telefoonnummer: string;
  emailadres: string;
}

export interface Medewerker {
  id: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  emailadres: string;
}
