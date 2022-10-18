import { enrich, combine, left, right } from "@/services";
import { usePersoonByBsn } from "../brp/service";
import { useKlantByBsn } from "../service";
import type { Klant, Persoon } from "../types";

const fromKlantToPersoon = enrich<Klant>()
  .by(({ bsn }) => bsn)
  .with(usePersoonByBsn);

const fromPersoonToKlant = enrich<Persoon>()
  .by(({ bsn }) => bsn)
  .with(useKlantByBsn);

const combined = combine(fromKlantToPersoon, fromPersoonToKlant);

const mapToEither = (record: Klant | Persoon) =>
  record._brand === "klant" ? left(record) : right(record);

export const useEnrichedPersoon = (getRecord: () => Klant | Persoon) =>
  combined(() => mapToEither(getRecord()));
