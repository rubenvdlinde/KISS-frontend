<template>
  <tr class="row-link">
    <template v-if="result.klant.success">
      <th scope="row" class="wrap">
        {{ result.klant.data?.naam }}
      </th>
      <td class="wrap">
        {{ result.klant.data?.emails }}
      </td>
      <td class="wrap">
        {{ result.klant.data?.telefoonnummers }}
      </td>
    </template>
    <td v-else colspan="3">
      <simple-spinner class="spinner" v-if="result.klant.loading" />
    </td>
    <td>
      {{ record.bsn }}
    </td>
    <template v-if="result.persoon.success">
      <td>
        <time
          v-if="result.persoon.data?.geboortedatum"
          :datetime="result.persoon.data.geboortedatum.datetime"
        >
          {{ result.persoon.data.geboortedatum.label }}
        </time>
      </td>
      <td>{{ result.persoon.data?.adres }}</td>
    </template>
    <td colspan="2" v-else>
      <simple-spinner class="spinner" v-if="result.persoon.loading" />
    </td>
    <td>
      <router-link
        v-if="result.klant.success && result.klant.data?.link"
        v-bind="result.klant.data.link"
      />
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { formatDateOnly } from "@/helpers/date";
import { ServiceResult } from "@/services";
import { computed } from "vue";
import { useEnrichPersoon, type CombinedPersoonSearchResult } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "../../components/SimpleSpinner.vue";

const props = defineProps<{ record: CombinedPersoonSearchResult }>();
const record = computed(() => props.record);
const enriched = useEnrichPersoon(record);

function mapKlant(klant: Klant) {
  const naam = [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
    .filter(Boolean)
    .join(" ");
  return {
    ...klant,
    naam,
    telefoonnummers: klant.telefoonnummers
      .map(({ telefoonnummer }) => telefoonnummer)
      .filter(Boolean)
      .join(", "),
    emails: klant.emails
      .map(({ email }) => email)
      .filter(Boolean)
      .join(", "),
    link: {
      to: `/klanten/${klant.id}`,
      title: `Details ${naam}`,
    },
  };
}

function getKlant() {
  const { klant, bsn } = props.record;
  if (klant) return ServiceResult.success(mapKlant(klant));
  if (!bsn) return ServiceResult.success(undefined);
  if (!enriched.success) return enriched;
  return {
    ...enriched,
    data: enriched.data.klant && mapKlant(enriched.data.klant),
  };
}

function mapPersoon(persoon: Persoon) {
  return {
    ...persoon,
    geboortedatum: persoon.geboortedatum && {
      label: formatDateOnly(persoon.geboortedatum),
      datetime: persoon.geboortedatum.toISOString().substring(0, 10),
    },
    adres: [persoon.postcode, persoon.huisnummer].filter(Boolean).join(" "),
  };
}

function getPersoon() {
  const { persoon, bsn } = props.record;
  if (persoon) return ServiceResult.success(mapPersoon(persoon));
  if (!bsn) return ServiceResult.success(undefined);
  if (!enriched.success) return enriched;

  return {
    ...enriched,
    data: enriched.data.persoon && mapPersoon(enriched.data.persoon),
  };
}

const result = computed(() => {
  return {
    bsn: record.value.bsn,
    klant: getKlant(),
    persoon: getPersoon(),
  };
});
</script>

<style scoped lang="scss">
td:empty::after {
  content: "-";
}

td > .spinner {
  font-size: inherit;
}
</style>
