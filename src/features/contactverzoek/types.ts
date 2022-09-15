export interface ContactverzoekForm {
  voornaam: string;
  voorvoegselAchternaam: string | undefined;
  achternaam: string;
  telefoonnummer1: string;
  telefoonnummer2: string;
  emailadres: string;
  attendee: string;
  description: string;
  useKlantFromStore: boolean;
  isDirty: boolean;
  isSubmitted: boolean;
  url: string | undefined;
}
