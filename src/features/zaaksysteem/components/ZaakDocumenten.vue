<template>
  <section>
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

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
            <td>{{ document.embedded.informatieobject.titel }}</td>
            <td>
              {{
                formatBytes(
                  parseInt(
                    document.embedded.informatieobject.bestandsomvang,
                    16
                  )
                )
              }}
            </td>
            <td>
              {{
                formatDateOnly(
                  new Date(document.embedded.informatieobject.creatiedatum)
                )
              }}
            </td>
            <td class="vertrouwelijkheid-label">
              {{
                document.embedded.informatieobject.vertrouwelijkheidaanduiding
              }}
            </td>
            <td>
              <a
                :href="`data:${document.embedded.informatieobject.formaat}; base64, ${document.embedded.informatieobject.inhoud}`"
                target="_blank"
                :download="document.embedded.informatieobject.titel"
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

  .vertrouwelijkheid-label::first-letter {
    text-transform: capitalize;
  }
}
</style>
