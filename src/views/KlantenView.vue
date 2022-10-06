<template>
  <article class="klant-panel">
    <utrecht-heading :level="1" model-value>Personen</utrecht-heading>
    <klant-zoeker @klant-selected="klantGevonden" />
  </article>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

import { useContactmomentStore } from "@/stores/contactmoment";
import { KlantZoeker } from "@/features/klant";
import { useRouter } from "vue-router";
import type { Klant } from "@/features/klant/types";
const router = useRouter();
//klant functies
const contactmomentStore = useContactmomentStore();

const klantGevonden = (klant: Klant) => {
  contactmomentStore.setKlant(klant);
  router.push({ name: "klantDetail", params: { klantId: klant.id } });
};
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
