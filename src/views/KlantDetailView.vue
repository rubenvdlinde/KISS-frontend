<template>
  <section>
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

    <utrecht-heading :level="2" model-value
      >Openstaande contactverzoeken</utrecht-heading
    >
    <simple-spinner v-if="contactverzoeken.loading" />
    <contactverzoeken-overzicht
      v-if="contactverzoeken.success"
      :contactverzoeken="contactverzoeken.data.page"
    />

    <!-- Zaken -->
    <zaken-overzicht-klantbeeld v-if="klantBsn" :klant-bsn="klantBsn" />

    <!-- Contactmomenten -->
    <utrecht-heading class="contactmomenten-header" model-value :level="2">
      Contactmomenten
    </utrecht-heading>

    <simple-spinner v-if="contactmomenten.loading" />

    <span v-if="contactmomenten.error">
      Er ging iets mis. Probeer het later nog eens.
    </span>

    <template v-if="contactmomenten.success">
      <contactmomenten-overzicht :contactmomenten="contactmomenten.data.page" />

      <pagination
        class="pagination"
        :pagination="contactmomenten.data"
        @navigate="onContactmomentenNavigate"
      />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { ContactmomentenOverzicht } from "@/features/contactmoment";
import { KlantDetails } from "@/features/klant";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ZakenOverzichtKlantbeeld from "@/features/zaaksysteem/ZakenOverzichtKlantbeeld.vue";
import type { Klant } from "@/features/klant/types";
import { fetchKlant } from "@/features/klant/service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ContactverzoekenOverzicht from "../features/contactmoment/ContactverzoekenOverzicht.vue";
import Pagination from "../nl-design-system/components/Pagination.vue";
import {
  useContactmomentenByKlantId,
  useContactverzoekenByKlantId,
} from "@/features/shared/get-contactmomenten-service";

const props = defineProps<{ klantId: string }>();

const loading = ref(false);

const contactmomentStore = useContactmomentStore();

const klant = ref<Klant>();

const klantBsn = computed(() => klant.value?.bsn);

watch(
  () => props.klantId,
  (klantId) => {
    if (!klantId) {
      klant.value = undefined;
      return;
    }

    const fromStore = contactmomentStore.contactmomenten
      .flatMap(({ vragen }) => vragen)
      .flatMap(({ klanten }) => klanten)
      .map(({ klant }) => klant)
      .find(({ id }) => id === klantId);

    if (fromStore) {
      klant.value = fromStore;
      return;
    }

    loading.value = true;

    fetchKlant(klantId)
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
  if (!k || k === contactmomentStore.klantVoorHuidigeVraag) return;
  contactmomentStore.setKlant(k);
});

const contactverzoekenPage = ref(1);
const contactverzoeken = useContactverzoekenByKlantId(
  computed(() => props.klantId),
  contactverzoekenPage
);

const contactmomentenPage = ref(1);
const contactmomenten = useContactmomentenByKlantId(
  computed(() => props.klantId),
  contactmomentenPage
);

const onContactmomentenNavigate = (page: number) => {
  contactmomentenPage.value = page;
};
</script>

<style scoped lang="scss">
nav {
  list-style: none;
  a {
    text-decoration: none;
  }
}

section > * {
  margin-block-end: var(--spacing-large);
}
</style>
