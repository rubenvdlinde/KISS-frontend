import { type Klant, useKlantByVestigingsnummer } from "@/features/klant";
import { combineEnrichers } from "@/services";
import { useBedrijfByVestigingsnummer } from "../service";
import type { Bedrijf } from "../types";

const isKlant = (klantOfBedrijf: Klant | Bedrijf): klantOfBedrijf is Klant => {
  return klantOfBedrijf._typeOfKlant === "klant";
};

export const useEnrichedBedrijf = combineEnrichers(
  useKlantByVestigingsnummer,
  useBedrijfByVestigingsnummer,
  (either) => either.vestigingsnummer,
  isKlant
);
