<template>
  <section class="container">
    <utrecht-heading class="contactmomenten-header" model-value :level="2">
      Zaken
    </utrecht-heading>

    <simple-spinner v-if="zaken.loading" />

    <p v-else-if="zaken.error">Er ging iets mis. Probeer het later nog eens.</p>

    <table v-else-if="zaken.data.length">
      <thead>
        <th>Zaaknummer</th>
        <th>Zaaktype</th>
        <th>Status</th>
        <th>Behandelaar</th>
        <th>Indien datum</th>
        <th>Fatale datum</th>
      </thead>

      <tbody>
        <tr v-for="zaak in zaken.data" :key="zaak.id">
          <td>{{ zaak.identificatie }}</td>
          <td>{{ zaak.zaaktype }}</td>
          <td>{{ zaak.status }}</td>
          <td>{{ zaak.behandelaar }}</td>
          <td>{{ zaak.startdatum }}</td>
          <td>{{ zaak.fataleDatum }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { computed } from "vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { useZaaksysteemService } from "./service";

const props = defineProps({
  klantBsn: {
    type: Number,
    required: true,
  },
});

const klantBsn = computed(() => props.klantBsn);

const zaakService = useZaaksysteemService();

const zaken = zaakService.findByBsn(klantBsn).withFetcher();
</script>

<style lang="scss" scoped>
.container {
  margin-inline: var(--spacing-extralarge);
}

.container > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}

table {
  width: 100%;

  thead > th:not(:last-child) {
    padding-inline-end: var(--spacing-default);
  }

  td {
    padding-block: var(--spacing-default);
  }
}
</style>
