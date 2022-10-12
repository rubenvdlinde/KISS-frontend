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
        <tr v-for="klant in klanten" :key="klant.key" class="row-link">
          <th scope="row" class="wrap">
            {{ klant.naam }}
          </th>
          <td class="wrap">
            {{ klant.emails }}
          </td>
          <td class="wrap">
            {{ klant.telefoonnummers }}
          </td>
          <td>
            {{ klant.bsn }}
          </td>
          <td>
            <time
              v-if="klant.geboortedatum"
              :datetime="klant.geboortedatum.datetime"
            >
              {{ klant.geboortedatum.label }}
            </time>
          </td>
          <td>{{ klant.adres }}</td>
          <td><router-link v-bind="klant.link" /></td>
        </tr>
      </tbody>
    </template>
  </table>
</template>

<script lang="ts" setup>
import type { Klant } from "./types";
import { computed } from "vue";
import { formatDateOnly } from "@/helpers/date";

const props = defineProps<{ klanten: Klant[] }>();

const klanten = computed(() =>
  props.klanten.map((klant, idx) => {
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
      geboortedatum: klant.geboortedatum && {
        label: formatDateOnly(klant.geboortedatum),
        datetime: klant.geboortedatum.toISOString().substring(0, 10),
      },
      adres: [klant.postcode, klant.huisnummer].filter(Boolean).join(" "),
      key: idx,
    };
  })
);
</script>

<style scoped lang="scss">
td:empty::after {
  content: "-";
}
</style>
