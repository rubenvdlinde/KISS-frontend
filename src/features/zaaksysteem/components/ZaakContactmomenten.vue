<template>
  <section>
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

    <simple-spinner v-if="contactmomenten.loading" />

    <template v-if="contactmomenten.success && contactmomenten.data.length">
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
          <tr
            v-for="contactmoment in contactmomenten.data"
            :key="contactmoment.id"
          >
            <td>{{ formatDateOnly(new Date(contactmoment.startdatum)) }}</td>
            <td>{{ contactmoment["x-commongateway-metadata"].owner }}</td>
            <td>{{ contactmoment.kanaal }}</td>
            <td>{{ contactmoment.resultaat }}</td>
          </tr>
        </tbody>
      </table>
    </template>

    <span v-else-if="contactmomenten.success && !contactmomenten.data.length"
      >Geen contactmomenten gevonden.</span
    >

    <span v-if="contactmomenten.error"
      >Er ging iets mis. Probeer het later nog eens.</span
    >
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { formatDateOnly } from "@/helpers/date";
import type { ZaakDetails } from "../types";
import { useZaaksysteemService } from "../service";
import SimpleSpinner from "../../../components/SimpleSpinner.vue";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const zaaksysteemService = useZaaksysteemService();
const contactmomenten = zaaksysteemService.getContactmomentenByZaak(
  props.zaak.self
);
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
    padding: var(--spacing-default);

    & > * {
      width: 25%;
      padding: var(--spacing-default);
    }
  }

  tbody > tr {
    background: var(--color-white);
    border-bottom: 2px solid var(--color-tertiary);
  }
}
</style>
