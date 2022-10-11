function isValidPhoneNumber(val: string) {
  if (!val) return true; // empty is allowed, handeld by required attribute
  const numberCount = (val.match(/[0-9]/g) ?? []).length;
  const hasOnlyAllowedChars = /^(\+|-| |[0-9])*$/.test(val);
  return numberCount >= 10 && hasOnlyAllowedChars;
}

export function customPhoneValidator(value: string): string[] {
  return isValidPhoneNumber(value)
    ? []
    : [`'${value}' lijkt geen valide telefoonnummer.`];
}
interface Postcode {
  numbers: string;
  digits: string;
}

export interface PostcodeHuisnummer {
  postcode: Postcode;
  huisnummer: string;
}

export function parsePostcodeHuisnummer(
  input: string
): PostcodeHuisnummer | Error {
  const matches =
    input.match(/([1-9][0-9]{3}).*([A-Z]{2}).*([0-9]+)/)?.filter(Boolean) ?? [];

  if (matches.length !== 4) {
    return new Error("Voer een valide postcode en huisnummer in");
  }

  return {
    postcode: {
      numbers: matches[1],
      digits: matches[2],
    },
    huisnummer: matches[3],
  };
}

export function parseDutchDate(input: string): Date | Error {
  const matches =
    input
      .match(/([0-9][0-9]?)[-|/]([0-9][0-9]?)[-|/]([0-9]{4})$/)
      ?.filter(Boolean) ?? [];

  if (matches.length !== 4) {
    return new Error("Voer een valide datum in volgens het patroon 23-12-1900");
  }

  const year = +matches[3];
  const month = +matches[2] - 1;
  const day = +matches[1];

  return new Date(year, month, day);
}
