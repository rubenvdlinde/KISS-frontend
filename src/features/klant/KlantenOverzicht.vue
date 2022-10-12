<template>
  <table v-if="klanten.length" class="overview">
    <slot name="caption" />
    <thead>
      <tr>
        <th>Naam</th>
        <th>E-mailadres</th>
        <th>Tel. nummer</th>
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
        <td><router-link v-bind="klant.link" /></td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import type { Klant } from "./types";
import { computed } from "vue";

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
      key: idx,
    };
  })
);
</script>
