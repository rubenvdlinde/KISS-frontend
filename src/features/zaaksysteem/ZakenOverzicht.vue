<template>
  <table v-if="zaken.length > 0">
    <thead>
      <th>Zaaknummer</th>
      <th>Zaaktype</th>
      <th>Status</th>
      <th>Datum ingediend</th>
      <th></th>
    </thead>
    <tbody>
      <tr
        v-for="zaak in zaken"
        :key="zaak.id"
        @click="handleZaakSelected(zaak)"
      >
        <td>{{ zaak.identificatie }}</td>
        <td>{{ zaak.zaaktype }}</td>
        <td>{{ zaak.status }}</td>
        <td>{{ formatDateOnly(zaak.registratiedatum) }}</td>
        <td>
          <zaak-contactmoment-koppelaar
            :zaak="zaak"
            :vraag="vraag"
          ></zaak-contactmoment-koppelaar>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { formatDateOnly } from "@/helpers/date";
import type { PropType } from "vue";
import ZaakContactmomentKoppelaar from "./zaakContactmomentKoppelaar.vue";
import type { Zaak } from "./types";
import type { Vraag } from "@/stores/contactmoment";

const emit = defineEmits(["zaakSelected"]);

const handleZaakSelected = (zaak: Zaak) => {
  emit("zaakSelected", zaak);
};

defineProps({
  zaken: { type: Array as PropType<Zaak[]>, required: true },
  vraag: { type: Object as PropType<Vraag>, required: true },
});
</script>

<style lang="scss" scoped>
th,
td {
  text-align: left;
  padding-inline-start: var(--spacing-default);
  padding-block: var(--spacing-default);
}

tr {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-primary);

  &:hover {
    background-color: var(--color-secondary);
    cursor: pointer;
  }
}
</style>
