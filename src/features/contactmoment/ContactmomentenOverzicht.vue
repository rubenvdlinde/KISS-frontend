<template>
  <table v-if="contactmomenten.length">
    <thead>
      <th>Datum</th>
      <th>Medewerker</th>
      <th>Kanaal</th>
      <th>Gespreksresultaat</th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="contactmoment in contactmomenten" :key="contactmoment.id">
        <td>{{ contactmoment.registratiedatum }}</td>
        <td>
          {{ contactmoment.medewerker }}
        </td>
        <td>{{ contactmoment.kanaal }}</td>
        <td>{{ contactmoment.resultaat }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>Geen contactmomenten gevonden.</p>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import type { ContacmomentViewModel } from "./types";

defineProps({
  contactmomenten: {
    type: Array as PropType<ContacmomentViewModel[]>,
    required: true,
  },
});
</script>
