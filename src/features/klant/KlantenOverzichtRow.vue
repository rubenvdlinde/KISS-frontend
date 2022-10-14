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
      {{ result.bsn }}
    </td>
    <template v-if="result.persoon.success">
      <td>
        <dutch-date
          v-if="result.persoon.data?.geboortedatum"
          :date="result.persoon.data.geboortedatum"
        />
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
      <button
        type="button"
        v-else-if="result.klant.success"
        @click="result.create()"
      >
        Aanmaken
      </button>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { mapServiceData } from "@/services";
import { computed } from "vue";
import { ensureKlant, useKlantByBsn } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { useRouter } from "vue-router";
import { usePersoonByBsn } from "./brp/service";
import { useEnricher } from "./service-data-enricher";
import DutchDate from "../../components/DutchDate.vue";

const props = defineProps<{ record: Klant | Persoon }>();

const getEnrichedData = useEnricher(
  () =>
    props.record._brand === "klant"
      ? [props.record, undefined]
      : [undefined, props.record],
  (r) => r?.bsn,
  useKlantByBsn,
  usePersoonByBsn
);

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapKlant(klant?: Klant) {
  if (!klant) return klant;
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
      to: getKlantUrl(klant),
      title: `Details ${naam}`,
    },
  };
}

function mapPersoon(persoon?: Persoon) {
  return (
    persoon && {
      ...persoon,
      adres: [persoon.postcode, persoon.huisnummer].filter(Boolean).join(" "),
    }
  );
}

const router = useRouter();

const result = computed(() => {
  const [bsn, klantData, persoonData] = getEnrichedData();

  const create = async () => {
    if (!bsn || !klantData.success || klantData.data?.id) return;
    const newKlant = await ensureKlant(bsn);
    const url = getKlantUrl(newKlant);
    router.push(url);
  };

  return {
    bsn,
    klant: mapServiceData(klantData, mapKlant),
    persoon: mapServiceData(persoonData, mapPersoon),
    create,
  };
});
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
</style>
