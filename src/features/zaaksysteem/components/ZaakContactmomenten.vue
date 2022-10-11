<template>
  <section class="container">
    <utrecht-heading :level="2" modelValue>Contactmomenten</utrecht-heading>

    <simple-spinner v-if="contactmomenten.loading" />

    <template
      v-if="contactmomenten.success && contactmomenten.data.page.length"
    >
      <contactmomenten-overzicht :contactmomenten="contactmomenten.data.page" />
      <pagination :pagination="contactmomenten.data" @navigate="navigate" />
    </template>

    <span v-if="contactmomenten.error"
      >Er ging iets mis. Probeer het later nog eens.</span
    >
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import type { ZaakDetails } from "../types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ContactmomentenOverzicht from "@/features/contactmoment/ContactmomentenOverzicht.vue";
import Pagination from "@/nl-design-system/components/Pagination.vue";
import { useContactmomentenByZaakUrl } from "@/features/shared/get-contactmomenten-service";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const self = computed(() => props.zaak.self);
const page = ref(1);

const navigate = (val: number) => {
  page.value = val;
};

const contactmomenten = useContactmomentenByZaakUrl(self, page);
</script>

<style scoped lang="scss">
.container {
  padding: var(--spacing-large);

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
}
</style>
