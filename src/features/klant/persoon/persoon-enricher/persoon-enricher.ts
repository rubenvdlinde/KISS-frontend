import { combineEnrichers } from "@/services";
import { usePersoonByBsn } from "../service";
import { useKlantByBsn } from "../../service";
import type { Persoon } from "../types";
import type { Klant } from "../../types";

const isKlant = (klantOfPersoon: Klant | Persoon): klantOfPersoon is Klant =>
  klantOfPersoon._typeOfKlant === "klant";

export const useEnrichedPersoon = combineEnrichers(
  useKlantByBsn,
  usePersoonByBsn,
  (either) => either.bsn,
  isKlant
);
