<template>
  <dialog ref="dialog">
    <simple-spinner />
  </dialog>
  <tr class="row-link" v-bind="$attrs">
    <th scope="row" class="wrap">
      <simple-spinner class="spinner" v-if="result.naam.loading" />
      <template v-else-if="result.naam.success">{{
        result.naam.data
      }}</template>
    </th>
    <td class="wrap">
      <simple-spinner class="spinner" v-if="result.emails.loading" />
      <template v-if="result.emails.success">{{ result.emails.data }}</template>
    </td>
    <td class="wrap">
      <simple-spinner class="spinner" v-if="result.telefoonnummers.loading" />
      <template v-if="result.telefoonnummers.success">{{
        result.telefoonnummers.data
      }}</template>
    </td>
    <td>
      {{ result.bsn }}
    </td>
    <td>
      <simple-spinner class="spinner" v-if="result.geboortedatum.loading" />
      <dutch-date
        v-else-if="result.geboortedatum.success && result.geboortedatum.data"
        :date="result.geboortedatum.data"
      />
    </td>
    <td>
      <simple-spinner
        class="spinner"
        v-if="result.postcodeHuisnummer.loading"
      />
      <template v-if="result.postcodeHuisnummer.success">{{
        result.postcodeHuisnummer.data
      }}</template>
    </td>
    <td>
      <simple-spinner class="spinner" v-if="result.detailLink.loading" />
      <template v-if="result.detailLink.success">
        <router-link
          v-if="result.detailLink.data"
          v-bind="result.detailLink.data"
        />
        <button
          type="button"
          title="Aanmaken"
          v-else
          @click="result.create()"
        />
      </template>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { mapServiceData, ServiceResult, type ServiceData } from "@/services";
import { computed, reactive, ref } from "vue";
import { ensureKlantForBsn } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { useRouter } from "vue-router";
import DutchDate from "@/components/DutchDate.vue";
import { useEnrichedPersoon } from "./persoon-enricher";

const props = defineProps<{ record: Klant | Persoon }>();

const [bsn, persoonData, klantData] = useEnrichedPersoon(() => props.record);

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapNaam(klant: Klant | Persoon | null) {
  return (
    klant &&
    [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
      .filter(Boolean)
      .join(" ")
  );
}

function mapTelefoonnummers(klant: Klant | null) {
  return (
    klant &&
    klant.telefoonnummers
      .map(({ telefoonnummer }) => telefoonnummer)
      .filter(Boolean)
      .join(", ")
  );
}

function mapEmails(klant: Klant | null) {
  return (
    klant &&
    klant.emails
      .map(({ email }) => email)
      .filter(Boolean)
      .join(", ")
  );
}

function mapLink(klant: Klant | null, naam: string | null) {
  return (
    klant && {
      to: getKlantUrl(klant),
      title: `Details ${naam}`,
    }
  );
}

function mapGeboortedatum(persoon: Persoon | null) {
  return persoon && persoon.geboortedatum;
}

function mapPostcodeHuisnummer(persoon: Persoon | null) {
  return (
    persoon && [persoon.postcode, persoon.huisnummer].filter(Boolean).join(" ")
  );
}

const router = useRouter();

const dialog = ref<HTMLDialogElement>();

const create = async () => {
  try {
    if (!bsn.value) return;
    dialog.value?.showModal();
    const newKlant = await ensureKlantForBsn(bsn.value);
    const url = getKlantUrl(newKlant);
    router.push(url);
  } finally {
    dialog.value?.close();
  }
};

const klantNaam = computed(() => mapServiceData(klantData.value, mapNaam));
const persoonNaam = computed(() => mapServiceData(persoonData.value, mapNaam));

const naam = computed<ServiceData<string | null>>(() => {
  if (klantNaam.value.loading && persoonNaam.value.loading)
    return ServiceResult.loading();
  if (klantNaam.value.success && klantNaam.value.data)
    return ServiceResult.success(klantNaam.value.data);
  if (persoonNaam.value.success && persoonNaam.value.data)
    return ServiceResult.success(persoonNaam.value.data);
  return ServiceResult.success(null);
});

const telefoonnummers = computed(() =>
  mapServiceData(klantData.value, mapTelefoonnummers)
);

const emails = computed(() => mapServiceData(klantData.value, mapEmails));

const geboortedatum = computed(() =>
  mapServiceData(persoonData.value, mapGeboortedatum)
);

const postcodeHuisnummer = computed(() =>
  mapServiceData(persoonData.value, mapPostcodeHuisnummer)
);

const detailLink = computed(() => {
  const n = naam.value.success ? naam.value.data : null;
  return mapServiceData(klantData.value, (k) => mapLink(k, n));
});

function getResult() {
  return reactive({
    naam,
    bsn,
    telefoonnummers,
    emails,
    geboortedatum,
    postcodeHuisnummer,
    create,
    detailLink,
  });
}

const result = getResult();
</script>

<style scoped lang="scss">
td {
  > .spinner {
    font-size: inherit;
  }

  &:empty::after {
    content: "-";
  }
}

dialog[open] {
  width: 100%;
  height: 100%;
  display: flex;
  place-content: center;
  place-items: center;
}
</style>
