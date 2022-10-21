import {
  type Klant,
  useBedrijfKlantByVestigingsnummer,
} from "@/features/klant";
import { combineEnrichers } from "@/services";
import { useBedrijfHandelsregisterByVestigingsnummer } from "../service";
import type { Bedrijf } from "../types";

const isBedrijfKlant = (
  klantOfHandelsRegister: Klant | Bedrijf
): klantOfHandelsRegister is Klant => {
  return klantOfHandelsRegister._typeOfKlant === "klant";
};

export const useEnrichedBedrijf = combineEnrichers(
  useBedrijfKlantByVestigingsnummer,
  useBedrijfHandelsregisterByVestigingsnummer,
  (either) => either.vestigingsnummer,
  isBedrijfKlant
);
