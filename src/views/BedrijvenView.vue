<template>
  <section>
    <utrecht-heading :level="1">Bedrijven</utrecht-heading>

    <bedrijf-zoeker />
  </section>
</template>

<script setup lang="ts">
import { Heading as UtrechtHeading } from "@utrecht/component-library-vue";
import { BedrijfZoeker } from "@/features/klant";
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
