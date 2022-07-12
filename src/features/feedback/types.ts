export interface Feedback {
  uri: unknown | URL;
  naam: string; //naam artikel. automatisch vullen
  content: string; //tekst waar de feedback betrekking op heeft
  opmerking: string; //de feedback: wat is er mis
  aanleiding: string; //of bron
  contactgegevens: string; // email of telefoonnummer melder
}

export interface ServiceResult {
  loading: boolean;
  error: boolean;
  success: boolean | null;
}
