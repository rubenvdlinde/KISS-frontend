<template>
  <article class="klant-panel" v-show="showKlantenSearch">
    <utrecht-heading :level="1" model-value>Klanten</utrecht-heading>
    <klant-zoeker @klant-selected="klantGevonden" />
  </article>
  <article
    class="klant-panel"
    v-show="!showKlantenSearch && contactmomentStore.klant"
  >
    <utrecht-heading :level="1" model-value>Klantinformatie</utrecht-heading>
    <menu>
      <li>
        <button
          @click="showKlantenSearch = true"
          class="utrecht-button utrecht-button--secondary-action"
        >
          Klanten zoeken
        </button>
      </li>
    </menu>

    <klant-details
      v-if="contactmomentStore.klant"
      :klant="contactmomentStore.klant"
    />
    <zaken-overzicht-klantbeeld v-if="klantBsn" :klant-bsn="klantBsn" />
    <contactmomenten-overzicht v-if="klantId" :klant-id="klantId" />
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

import { useContactmomentStore } from "@/stores/contactmoment";

import { ContactmomentenOverzicht } from "@/features/contactmoment";
import { KlantZoeker, KlantDetails } from "@/features/klant";

import ZakenOverzichtKlantbeeld from "../features/zaaksysteem/ZakenOverzichtKlantbeeld.vue";
import { useRouter } from "vue-router";
import type { Klant } from "@/features/klant/types";
const router = useRouter();
//klant functies
const showKlantenSearch = ref(true);
const contactmomentStore = useContactmomentStore();

const klantGevonden = (klant: Klant) => {
  // showKlantenSearch.value = false;
  contactmomentStore.setKlant(klant);
  router.push({ name: "klantDetail", params: { id: klant.id } });
};

const klantId = computed(() => contactmomentStore.klant?.id || "");
const klantBsn = computed(() => contactmomentStore.klant?.bsn || "");
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
