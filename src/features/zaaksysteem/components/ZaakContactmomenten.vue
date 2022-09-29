<template>
  <section class="container">
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

    <simple-spinner v-if="contactmomenten.loading" />

    <contactmomenten-overzicht
      v-if="contactmomenten.success && contactmomenten.data.length"
      :contactmomenten="contactmomenten.data"
    />

    <span v-if="contactmomenten.error"
      >Er ging iets mis. Probeer het later nog eens.</span
    >
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import type { ZaakDetails } from "../types";
import { useZaaksysteemService } from "../service";
import SimpleSpinner from "../../../components/SimpleSpinner.vue";
import ContactmomentenOverzicht from "../../contactmoment/ContactmomentenOverzicht.vue";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const zaaksysteemService = useZaaksysteemService();
const contactmomenten = zaaksysteemService.getContactmomentenByZaak(
  props.zaak.self
);
</script>

<style scoped lang="scss">
.container {
  padding: var(--spacing-large);

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
}
</style>
