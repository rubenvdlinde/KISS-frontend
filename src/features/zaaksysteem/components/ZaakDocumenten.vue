<template>
  <section>
    <utrecht-heading :level="2" modelValue>Documenten</utrecht-heading>

    <template v-if="zaak.documenten?.length">
      <table>
        <thead>
          <tr>
            <th>Naam</th>
            <th>Formaat</th>
            <th>Creatiedatum</th>
            <th>Vertrouwelijk</th>
            <th>Downloaden</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="document in zaak.documenten" :key="document.id">
            <td class="wrap">{{ document.titel }}</td>
            <td>{{ formatBytes(document.bestandsomvang) }}</td>
            <td>{{ formatDateOnly(document.creatiedatum) }}</td>
            <td class="vertrouwelijkheid-label">
              {{ document.vertrouwelijkheidaanduiding }}
            </td>
            <td>
              <a
                :href="`data:${document.formaat}; base64, ${document.inhoud}`"
                target="_blank"
                :download="document.titel"
                >> Downloaden</a
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <span v-if="!zaak.documenten?.length">Geen documenten gevonden.</span>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./../types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { formatDateOnly } from "@/helpers/date";
import { formatBytes } from "@/helpers/formatBytes";

defineProps<{
  zaak: ZaakDetails;
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
  padding-inline: var(--spacing-default);

  thead {
    color: var(--color-white);
    background: var(--color-tertiary);

    th {
      font-weight: normal;
      text-align: start;
    }
  }

  th,
  td {
    padding-block: var(--spacing-default);
    padding-inline-start: var(--spacing-default);

    &:not(.wrap) {
      white-space: nowrap;
    }

    &:last-child {
      padding-inline-end: var(--spacing-default);
    }
  }

  tbody > tr {
    background: var(--color-white);
    border-bottom: 2px solid var(--color-tertiary);
  }

  .vertrouwelijkheid-label::first-letter {
    text-transform: capitalize;
  }
}
</style>
