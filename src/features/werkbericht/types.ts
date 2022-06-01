export interface Werkbericht {
  title: string;
  date: Date;
  content: string;
}

export type TaxonomyFilter =
  | {
      audience: string;
    }
  | {
      type: string;
    };
