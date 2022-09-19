export type SearchResult = {
  id: string;
  title: string;
  source: string;
  content: string;
  url?: URL;
  jsonObject: any;
};

export type Source = {
  type: string;
  name: string;
};

export type Medewerker = {
  id: string;
  voornaam: string;
  voorvoegselAchternaam?: string;
  achternaam: string;
  emailadres: string;
  shouldStore?: boolean;
};
