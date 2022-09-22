<template>
  <section>
    <utrecht-heading :level="2" modelValue>Historie</utrecht-heading>

    <span>Dit tabblad is nog in ontwikkeling.</span>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./../types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

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
</style>
