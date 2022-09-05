import type { Klant } from "@/stores/contactmoment";

export type UpdateContactgegevensParams = Pick<
  Klant,
  "id" | "telefoonnummers" | "emails"
>;
