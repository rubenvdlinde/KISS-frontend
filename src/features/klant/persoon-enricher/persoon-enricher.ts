import { enrich, combine } from "@/services";
import { usePersoonByBsn } from "../brp/service";
import { useKlantByBsn } from "../service";
import type { Klant, Persoon } from "../types";

const fromKlantToPersoon = enrich<Klant>()
  .by(({ bsn }) => bsn)
  .with(usePersoonByBsn);

const fromPersoonToKlant = enrich<Persoon>()
  .by(({ bsn }) => bsn)
  .with(useKlantByBsn);

const isKlant = (klantOfPersoon: Klant | Persoon): klantOfPersoon is Klant =>
  klantOfPersoon._typeOfKlant === "klant";

export const useEnrichedPersoon = combine(
  fromKlantToPersoon,
  fromPersoonToKlant,
  isKlant
);
