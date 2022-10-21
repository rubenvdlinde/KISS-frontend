<template>
  <section>
    <utrecht-heading :level="1" model-value>Bedrijven</utrecht-heading>

    <bedrijf-zoeker />
  </section>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { BedrijfZoeker } from "@/features/klant";
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
