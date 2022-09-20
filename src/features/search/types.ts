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
};

export type Website = {
  title: string;
  url: string;
};

export type Kennisartikel = {
  id: string;
  title: string;
};

export type Nieuwsbericht = {
  id: string;
  title: string;
};

export type Werkinstructie = {
  id: string;
  title: string;
};
