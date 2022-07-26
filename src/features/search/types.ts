export type SearchResult = {
  id: string;
  title: string;
  source: string;
  content: string;
  url?: URL;
  jsonObject: any;
};

export type SearchJSON = {
  query: string;
  facets: facets;
};

export type facets = {
  object_bron: facet;
};

export type facet = {
  type: string;
};
