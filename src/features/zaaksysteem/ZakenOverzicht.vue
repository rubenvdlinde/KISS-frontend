<template>
  <table v-if="zaken.length > 0">
    <thead>
      <tr>
        <th>Zaaknummer</th>
        <th>Aanvrager</th>
        <th>Zaaktype</th>
        <th>Status</th>
        <th>Behandelaar</th>
        <th>Indiendatum</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="zaak in zaken"
        :key="zaak.id"
        @click="handleZaakSelected(zaak)"
      >
        <td>{{ zaak.identificatie }}</td>
        <td>{{ zaak.aanvrager }}</td>
        <td>{{ zaak.zaaktype }}</td>
        <td>{{ zaak.status }}</td>
        <td>{{ zaak.behandelaar }}</td>
        <td>{{ formatDateOnly(zaak.indienDatum) }}</td>
        <td>
          <button @click.prevent="handleZaakSelected(zaak)">
            {{ "> Ga naar" }}
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { formatDateOnly } from "@/helpers/date";
import type { PropType } from "vue";
import type { Zaak } from "./types";
import { useContactmomentStore, type Vraag } from "@/stores/contactmoment";
import { useRouter } from "vue-router";

const router = useRouter();
const contactmomentStore = useContactmomentStore();

const handleZaakSelected = (zaak: Zaak) => {
  if (!contactmomentStore.huidigContactmoment) return;

  contactmomentStore.upsertZaak(
    zaak,
    contactmomentStore.huidigContactmoment.huidigeVraag
  );

  router.push({ name: "zaakDetail", params: { zaakId: zaak.id } });
};

defineProps({
  zaken: { type: Array as PropType<Zaak[]>, required: true },
  vraag: { type: Object as PropType<Vraag | undefined>, required: true },
});
</script>

<style lang="scss" scoped>
table {
  width: 100%;

  thead {
    color: var(--color-white);
    background-color: var(--color-tertiary);
  }

  tbody > tr:hover {
    cursor: pointer;
    background-color: var(--color-secondary);
  }

  tr {
    border-bottom: 1px solid var(--color-primary);

    th,
    td {
      text-align: left;
      font-weight: normal;
      padding-inline: var(--spacing-default);
      padding-block: var(--spacing-default);
    }

    td button {
      all: unset;
      white-space: nowrap;
      text-decoration: underline;
    }
  }
}
</style>
