<template>
  <table class="overview">
    <slot name="caption" />
    <template v-if="klanten.length">
      <thead>
        <tr>
          <th>Naam</th>
          <th>E-mailadres</th>
          <th>Tel. nummer</th>
          <th>Bsn</th>
          <th>Geb. datum</th>
          <th>Adres</th>
          <th class="row-link-header">Details</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in klanten" :key="record.idx" class="row-link">
          <template v-if="record.klant">
            <th scope="row" class="wrap">
              {{ record.klant.naam }}
            </th>
            <td class="wrap">
              {{ record.klant.emails }}
            </td>
            <td class="wrap">
              {{ record.klant.telefoonnummers }}
            </td>
          </template>
          <td v-else colspan="3"></td>
          <td>
            {{ record.bsn }}
          </td>
          <template v-if="record.persoon">
            <td>
              <time
                v-if="record.persoon.geboortedatum"
                :datetime="record.persoon.geboortedatum.datetime"
              >
                {{ record.persoon.geboortedatum.label }}
              </time>
            </td>
            <td>{{ record.persoon.adres }}</td>
          </template>
          <td colspan="2" v-else></td>
          <td>
            <router-link v-if="record.klant?.link" v-bind="record.klant.link" />
          </td>
        </tr>
      </tbody>
    </template>
  </table>
</template>

<script lang="ts" setup>
import type { Klant, Persoon } from "./types";
import { computed } from "vue";
import { formatDateOnly } from "@/helpers/date";
import type { CombinedPersoonSearchResult } from "./service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";

const props = defineProps<{ klanten: CombinedPersoonSearchResult[] }>();

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

const klanten = computed(() =>
  props.klanten.map((record, idx) => {
    const klant = record.klant && mapKlant(record.klant);

    const persoon = record.persoon && mapPersoon(record.persoon);

    return {
      ...record,
      idx,
      klant,
      persoon,
    };
  })
);
</script>

<style scoped lang="scss">
td:empty::after {
  content: "-";
}
</style>
