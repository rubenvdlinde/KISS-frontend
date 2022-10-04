import type { SearchCategory } from "./types";

export const useBedrijfService = () => {
  const findBedrijf = (searchQuery: string, searchCategory: SearchCategory) => {
    switch (searchCategory) {
      case "handelsnaam":
        // GET Handelsregister ?handelsnaam;
        break;
      case "kvkNummer":
        // GET Handelsregister ?kvkNummer;
        break;
      case "postcodeHuisnummer":
        // GET Handelsregister ?postcode&huisnummer (optioneel: &huisnummerToevoeging)
        break;
      case "emailadres":
        // GET Klantregister
        break;
      case "telefoonnummer":
        // GET Klantregister
        break;
    }
    console.log({ searchQuery, searchCategory });
  };

  return { findBedrijf };
};
