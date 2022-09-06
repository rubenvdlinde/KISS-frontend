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

const emit = defineEmits(["ZaakSelected"]);

const handleZaakSelected = (zaak: Zaak) => {
  emit("ZaakSelected", zaak);
};

defineProps({
  zaken: { type: Array as PropType<Zaak[]>, required: true },
});
</script>

<style lang="scss" scoped>
table {
  margin-top: var(--spacing-default);
}
th:not(:first-child),
td:not(:first-child) {
  padding-left: var(--spacing-small);
}

th,
td {
  padding-top: var(--spacing-small);
  padding-bottom: var(--spacing-small);

  padding-right: var(--spacing-small);
  vertical-align: middle;
  text-align: left;
}
</style>
