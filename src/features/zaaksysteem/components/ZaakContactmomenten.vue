<template>
  <section>
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

    <simple-spinner v-if="contactmomenten.loading" />

    <span v-if="contactmomenten.error">
      Er ging iets mis. Probeer het later nog eens.
    </span>

    <template v-if="contactmomenten.success">
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
            <td>Onbekend</td>
            <td>{{ contactmoment.kanaal }}</td>
            <td>{{ contactmoment.resultaat }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./../types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useZaaksysteemService } from "../service";
import SimpleSpinner from "../../../components/SimpleSpinner.vue";
import { formatDateOnly } from "@/helpers/date";

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
