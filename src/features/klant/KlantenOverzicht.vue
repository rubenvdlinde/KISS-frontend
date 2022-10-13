<template>
  <table class="overview">
    <slot name="caption" />
    <template v-if="records.length">
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
        <klanten-overzicht-row
          v-for="(record, idx) in records"
          :key="idx"
          :record="record"
          class="row-link"
        >
        </klanten-overzicht-row>
      </tbody>
    </template>
  </table>
</template>

<script lang="ts" setup>
import KlantenOverzichtRow from "./KlantenOverzichtRow.vue";
import type { Klant, Persoon } from "./types";
defineProps<{ records: Klant[] | Persoon[] }>();
</script>
