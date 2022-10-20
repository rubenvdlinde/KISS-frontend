<template><slot :enriched="result"></slot></template>
<script setup lang="ts">
import { mapServiceData, ServiceResult } from "@/services";
import { computed, reactive } from "vue";
import { useRouter } from "vue-router";
import { ensureKlantForVestigingsnummer, type Klant } from "@/features/klant";
import type { Bedrijf as Bedrijf, EnrichedBedrijf } from "../types";
import { useEnrichedBedrijf } from "./bedrijf-enricher";

const props = defineProps<{ record: Bedrijf | Klant }>();
const [vestigingsnummer, klantData, handelsregisterData] = useEnrichedBedrijf(
  () => props.record
);

const klantEmail = mapServiceData(klantData, (k) =>
  k?.emails?.map(({ email }) => email).find(Boolean)
);
const klantTelefoon = mapServiceData(klantData, (k) =>
  k?.telefoonnummers?.map(({ telefoonnummer }) => telefoonnummer).find(Boolean)
);
const handelsEmail = mapServiceData(handelsregisterData, (h) => h?.email);
const handelsTelefoon = mapServiceData(handelsregisterData, (h) => h?.email);

const email = computed(() => {
  if (handelsEmail.success && handelsEmail.data) return handelsEmail;
  if (klantEmail.success && klantEmail.data) return klantEmail;
  if (handelsEmail.loading || klantEmail.loading)
    return ServiceResult.loading();
  return handelsEmail;
});

const telefoonnummer = computed(() => {
  if (handelsTelefoon.success && handelsTelefoon.data) return handelsTelefoon;
  if (klantTelefoon.success && klantTelefoon.data) return klantTelefoon;
  if (klantTelefoon.loading || handelsTelefoon.loading)
    return ServiceResult.loading();
  return klantTelefoon;
});

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapLink(klant: Klant | null, naam: string | null) {
  return (
    klant && {
      to: getKlantUrl(klant),
      title: `Details ${naam}`,
    }
  );
}

const detailLink = computed(() => {
  const n = klantData.success ? klantData.data?.bedrijfsnaam : null;
  return mapServiceData(klantData, (k) => mapLink(k, n ?? null));
});

const router = useRouter();

const create = async () => {
  if (!vestigingsnummer.value) throw new Error();
  const newKlant = await ensureKlantForVestigingsnummer(vestigingsnummer.value);
  const url = getKlantUrl(newKlant);
  router.push(url);
};

const klantBedrijfsnaam = mapServiceData(
  klantData,
  (k) => k?.bedrijfsnaam ?? ""
);

const handelsBedrijfsnaam = mapServiceData(
  handelsregisterData,
  (k) => k?.bedrijfsnaam ?? ""
);

const bedrijfsnaam = computed(() => {
  if (handelsBedrijfsnaam.success && handelsBedrijfsnaam.data)
    return handelsBedrijfsnaam;
  if (klantBedrijfsnaam.success && klantBedrijfsnaam.data)
    return klantBedrijfsnaam;
  if (klantBedrijfsnaam.loading || klantBedrijfsnaam.loading)
    return ServiceResult.loading();
  return klantBedrijfsnaam;
});

const result: EnrichedBedrijf = reactive({
  bedrijfsnaam,
  kvknummer: mapServiceData(handelsregisterData, (h) => h?.kvknummer ?? ""),
  postcodeHuisnummer: mapServiceData(handelsregisterData, (h) =>
    [h?.postcode, h?.huisnummer].join(" ")
  ),
  email,
  telefoonnummer,
  detailLink,
  create,
});
</script>
