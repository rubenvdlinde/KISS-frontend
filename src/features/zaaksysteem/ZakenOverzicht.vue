<template>
  <h2>Zaken</h2>
  <table v-if="zaken.length > 0">
    <thead>
      <th>Zaaknummer</th>
      <th>Zaaktype</th>
      <th>Status</th>
      <th>Datum ingediend</th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="zaak in zaken" :key="zaak.id">
        <td>{{ zaak.identificatie }}</td>
        <td>{{ zaak.zaaktype }}</td>
        <td>{{ zaak.status }}</td>
        <td>{{ zaak.registratiedatum }}</td>
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
import type { Zaak } from "./types";
import type { PropType } from "vue";
import ZaakContactmomentKoppelaar from "./zaakContactmomentKoppelaar.vue";

defineProps({
  zaken: { type: Array as PropType<Zaak[]>, default: null },
});
</script>

<style lang="scss" scoped>
th,
td {
  padding-top: var(--spacing-small);
  padding-bottom: var(--spacing-small);
  padding-left: var(--spacing-small);
  padding-right: var(--spacing-small);
  vertical-align: middle;
}

th {
  text-align: left;
}
</style>
