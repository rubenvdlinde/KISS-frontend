<template>
  <section>
    <utrecht-heading :level="1" model-value>Klantinformatie</utrecht-heading>
    <nav>
      <ul>
        <li>
          <router-link :to="{ name: 'klanten' }">{{
            "< Klanten zoeken"
          }}</router-link>
        </li>
      </ul>
    </nav>
    <simple-spinner v-if="klant.loading" />
    <klant-details v-else-if="klant.success" :klant="klant.data" />
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
    <template v-if="klantBsn">
      <utrecht-heading model-value :level="2"> Zaken </utrecht-heading>

      <simple-spinner v-if="zaken.loading" />

      <span v-if="zaken.error">
        Er ging iets mis. Probeer het later nog eens.
      </span>

      <zaken-overzicht
        v-if="zaken.success"
        :zaken="zaken.data.page"
        :vraag="contactmomentStore.huidigContactmoment?.huidigeVraag"
      />
    </template>

    <!-- Contactmomenten -->
    <utrecht-heading model-value :level="2"> Contactmomenten </utrecht-heading>

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
import {
  ContactmomentenOverzicht,
  useContactverzoekenByKlantId,
} from "@/features/contactmoment";
import { KlantDetails, useKlant } from "@/features/klant";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ContactverzoekenOverzicht from "../features/contactmoment/ContactverzoekenOverzicht.vue";
import Pagination from "../nl-design-system/components/Pagination.vue";
import { useContactmomentenByKlantId } from "@/features/shared/get-contactmomenten-service";
import { useZakenByBsn } from "@/features/zaaksysteem";
import ZakenOverzicht from "../features/zaaksysteem/ZakenOverzicht.vue";

const props = defineProps<{ klantId: string }>();
const klantId = computed(() => props.klantId);
const contactmomentStore = useContactmomentStore();
const klant = useKlant(klantId);

watch(
  () => klant.success && klant.data,
  (k) => {
    if (!k) return;
    contactmomentStore.setKlant(k);
  },
  { immediate: true }
);

const contactverzoekenPage = ref(1);
const contactverzoeken = useContactverzoekenByKlantId(
  klantId,
  contactverzoekenPage
);

const contactmomentenPage = ref(1);
const contactmomenten = useContactmomentenByKlantId(
  klantId,
  contactmomentenPage
);

const onContactmomentenNavigate = (page: number) => {
  contactmomentenPage.value = page;
};

const klantBsn = computed(() =>
  !klant.success || !klant.data.bsn ? "" : klant.data.bsn
);
const zaken = useZakenByBsn(klantBsn);
</script>

<style scoped lang="scss">
nav {
  list-style: none;
}

section > * {
  margin-block-end: var(--spacing-large);
}

utrecht-heading {
  margin-block-end: 0;
}
</style>
