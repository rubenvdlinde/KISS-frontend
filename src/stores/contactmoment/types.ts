import type { Klant } from "@/features/klant/types";

export type NieuweKlant = Pick<
  Klant,
  | "voornaam"
  | "voorvoegselAchternaam"
  | "achternaam"
  | "telefoonnummers"
  | "emails"
>;

export interface Medewerker {
  id: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  emailadres: string;
  telefoonnummer1?: string;
  telefoonnummer2?: string;
}

export interface MedewerkerIdentificatie {
  identificatie: string;
  achternaam: string;
  voorletters: string;
  voorvoegselAchternaam: string;
}
