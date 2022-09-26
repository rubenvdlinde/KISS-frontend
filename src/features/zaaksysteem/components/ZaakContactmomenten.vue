<template>
  <section>
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

    <template v-if="contactmomenten.length">
      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Medewerker</th>
            <th>Kanaal</th>
            <th>Gespreksresultaat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contactmoment in contactmomenten" :key="contactmoment.id">
            <td>{{ formatDateOnly(new Date(contactmoment.startdatum)) }}</td>
            <td>Onbekend</td>
            <td>{{ contactmoment.kanaal }}</td>
            <td>{{ contactmoment.resultaat }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <span v-if="!contactmomenten.length">Geen contactmomenten gevonden.</span>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { formatDateOnly } from "@/helpers/date";
import type { ContactmomentViewModel } from "@/features/contactmoment";

defineProps<{
  contactmomenten: ContactmomentViewModel[];
}>();
</script>

<style scoped lang="scss">
section {
  padding: var(--spacing-large);

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
}

table {
  width: 100%;

  thead {
    color: var(--color-white);
    background: var(--color-tertiary);

    th {
      font-weight: normal;
    }
  }

  tr {
    display: flex;
    padding: var(--spacing-default);

    & > * {
      flex: 1;
    }
  }

  tbody > tr {
    background: var(--color-white);
    border-bottom: 2px solid var(--color-tertiary);
  }
}
</style>
