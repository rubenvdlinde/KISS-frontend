<template>
  <section>
    <utrecht-heading :level="1" model-value class="zaak-title">
      Zaken
    </utrecht-heading>
    <zaak-zoeker />
  </section>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ZaakZoeker } from "@/features/zaaksysteem";
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
