export interface Werkbericht {
  title: string;
  date: Date;
  content: string;
  type?: string;
}

const werkberichtTypes = ["Werkinstructie", "Nieuwsbericht"] as const;

export type WerkberichtType = typeof werkberichtTypes[number];
export function parseWerkberichtType(i: unknown): WerkberichtType | undefined {
  if ((werkberichtTypes as unknown as unknown[]).includes(i))
    return i as WerkberichtType;
}

export type WerkberichtFilter = {
  audience?: string;
  type?: WerkberichtType;
  search?: string;
};
