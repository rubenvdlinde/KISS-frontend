export interface Werkbericht {
  id: string;
  title: string;
  date: Date;
  content: string;
  types: string[];
  skills: string[];
  read: boolean;
  url: string;
}
