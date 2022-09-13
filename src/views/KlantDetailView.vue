<template>
  <article>
    <utrecht-heading :level="1" model-value>Klantinformatie</utrecht-heading>
    <nav>
      <ul>
        <li>
          <router-link
            :to="{ name: 'klanten' }"
            class="utrecht-button utrecht-button--secondary-action"
            >Klanten zoeken</router-link
          >
        </li>
      </ul>
    </nav>
    <simple-spinner v-if="loading" />
    <klant-details v-else-if="klant" :klant="klant" />
    <application-message
      v-else
      message="Er is geen klant gevonden"
      messageType="error"
    ></application-message>
    <zaken-overzicht-klantbeeld v-if="klantBsn" :klant-bsn="klantBsn" />
    <contactmomenten-overzicht :klant-id="klantId" />
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { ContactmomentenOverzicht } from "@/features/contactmoment";
import { KlantDetails } from "@/features/klant";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ZakenOverzichtKlantbeeld from "@/features/zaaksysteem/ZakenOverzichtKlantbeeld.vue";
import { useRoute } from "vue-router";
import type { Klant } from "@/features/klant/types";
import { fetchKlant } from "@/features/klant/service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const loading = ref(false);

const route = useRoute();

const contactmomentStore = useContactmomentStore();

const klant = ref<Klant>();

const klantId = computed(
  () =>
    (Array.isArray(route.params.id) ? route.params.id[0] : route.params.id) ||
    ""
);

const klantBsn = computed(() => klant.value?.bsn);

watch(
  klantId,
  (id) => {
    if (!id) {
      klant.value = undefined;
      return;
    }

    const fromStore = contactmomentStore.klanten
      .filter((x) => x.klant.id === klantId.value)
      .map((x) => x.klant)[0];

    if (fromStore) {
      klant.value = fromStore;
      return;
    }

    loading.value = true;

    fetchKlant(id)
      .then((newKlant) => {
        klant.value = newKlant;
      })
      .finally(() => {
        loading.value = false;
      });
  },
  { immediate: true }
);

watch(klant, (k) => {
  if (!k || k === contactmomentStore.klant) return;
  contactmomentStore.setKlant(k);
});
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
