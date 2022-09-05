<template>
  <article>
    <utrecht-heading :level="1" model-value>Klantinformatie</utrecht-heading>
    <nav>
      <li>
        <router-link
          :to="{ name: 'klanten' }"
          class="utrecht-button utrecht-button--secondary-action"
          >Klanten zoeken</router-link
        >
      </li>
    </nav>
    <template v-if="contactmomentStore.klant">
      <klant-details :klant="contactmomentStore.klant" />
      <zaken-overzicht-klantbeeld v-if="klantBsn" :klant-bsn="klantBsn" />
      <contactmomenten-overzicht v-if="klantId" :klant-id="klantId" />
    </template>
    <application-message
      v-else
      message="Er is geen klant geselecteerd"
      messageType="error"
    ></application-message>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

import { useContactmomentStore } from "@/stores/contactmoment";

import { ContactmomentenOverzicht } from "@/features/contactmoment";
import { KlantDetails } from "@/features/klant";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ZakenOverzichtKlantbeeld from "../features/zaaksysteem/ZakenOverzichtKlantbeeld.vue";

const contactmomentStore = useContactmomentStore();

const klantId = computed(() => contactmomentStore.klant?.id || "");
const klantBsn = computed(() => contactmomentStore.klant?.bsn || "");
</script>

<style scoped lang="scss">
nav {
  list-style: none;
  a {
    text-decoration: none;
  }
}

article > * {
  margin-block-end: var(--spacing-large);
}
</style>
