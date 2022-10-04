<template>
  <section>
    <utrecht-heading :level="1" model-value class="zaak-title">
      Zaken
    </utrecht-heading>
    <zaak-zoeker @zaak-selected="handleZaakSelected" />
  </section>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { ZaakZoeker } from "@/features/zaaksysteem";
import { useRouter } from "vue-router";
import type { Zaak } from "@/features/zaaksysteem/types";

const router = useRouter();

const contactmomentStore = useContactmomentStore();

const handleZaakSelected = (zaak: Zaak) => {
  if (!contactmomentStore.huidigContactmoment) return;
  contactmomentStore.upsertZaak(
    zaak,
    contactmomentStore.huidigContactmoment.huidigeVraag
  );
  router.push({ name: "zaakDetail", params: { zaakId: zaak.id } });
};
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
