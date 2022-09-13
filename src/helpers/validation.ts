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
