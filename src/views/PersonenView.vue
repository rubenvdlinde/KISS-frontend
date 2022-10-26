<template>
  <article class="klant-panel">
    <utrecht-heading :level="1" model-value>Personen</utrecht-heading>
    <persoon-zoeker />
  </article>
</template>

<script setup lang="ts">
import { Heading as UtrechtHeading } from "@utrecht/component-library-vue";
import { PersoonZoeker } from "@/features/klant";
</script>

<style scoped lang="scss">
.klant-panel {
  display: grid;
  gap: var(--spacing-large);
}

:deep([role="tablist"]),
.zaak-tabs :deep([role="tabpanel"]) {
  padding-inline: var(--spacing-extralarge);
}

:deep([role="tabpanel"]) {
  padding-block: var(--spacing-default);
}

.main-tabs {
  // grid-column: 2 / 5;

  --tab-bg: var(--color-white);

  ul li > article {
    margin-inline: var(--spacing-extralarge);
  }
}

.zaak-tabs {
  --tab-bg: var(--color-secondary);
  --tab-size: 1.25rem;
}
</style>
