<template>
  <table v-if="zaken.length > 0" class="overview">
    <slot name="caption"></slot>
    <thead>
      <tr>
        <th>Zaaknummer</th>
        <th>Aanvrager</th>
        <th>Zaaktype</th>
        <th>Status</th>
        <th>Behandelaar</th>
        <th>Indiendatum</th>
        <th class="row-link-header">Details</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="zaak in zaken" :key="zaak.id" class="row-link">
        <th scope="row">{{ zaak.identificatie }}</th>
        <td class="wrap">{{ zaak.aanvrager }}</td>
        <td class="wrap">{{ zaak.zaaktype }}</td>
        <td class="wrap">{{ zaak.status }}</td>
        <td>{{ zaak.behandelaar }}</td>
        <td>{{ formatDateOnly(zaak.indienDatum) }}</td>
        <td class="link">
          <router-link
            :to="`/zaken/${zaak.id}`"
            :title="`Details ${zaak.identificatie}`"
          ></router-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { formatDateOnly } from "@/helpers/date";
import type { PropType } from "vue";
import type { Zaak } from "./types";
import type { Vraag } from "@/stores/contactmoment";

defineProps({
  zaken: { type: Array as PropType<Zaak[]>, required: true },
  vraag: { type: Object as PropType<Vraag | undefined>, required: true },
});
</script>
