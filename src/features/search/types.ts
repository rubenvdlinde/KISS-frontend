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
