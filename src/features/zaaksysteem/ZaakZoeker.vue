<template>
  <section>
    <form class="search-bar" @submit.prevent="zoekOpZaak">
      <label>
        <input
          type="search"
          placeholder="Zoek op zaaknummer"
          v-model="store.searchField"
          title="ZAAK-1"
        />
      </label>
      <button title="Zoeken">
        <span>Zoeken</span><utrecht-icon-loupe model-value />
      </button>
    </form>

    <template v-if="store.currentSearch">
      <application-message
        v-if="zaken.error"
        messageType="error"
        message="Er is een probleem opgetreden."
      ></application-message>
      <simple-spinner v-else-if="zaken.loading"></simple-spinner>
      <section
        class="resultaten-container"
        v-if="zaken.success && zaken.data.page.length > 0"
      >
        <div class="resultaten-heading-container">
          <utrecht-heading class="resultaten-heading" :level="2" model-value
            >Zoekresultaten</utrecht-heading
          >
          <div class="resultaten-found">
            {{
              `${zaken.data.page.length} ${
                zaken.data.page.length > 1 ? "resultaten" : "resultaat"
              } gevonden`
            }}
          </div>
        </div>
        <zaken-overzicht
          :zaken="zaken.data.page"
          :vraag="contactmomentStore.huidigContactmoment?.huidigeVraag"
          @zaak-selected="zaakSelected"
        />
      </section>
      <paragraph v-if="zaken.success && !zaken.data.page.length"
        >Er zijn geen zaken gevonden.</paragraph
      >
    </template>
  </section>
</template>

<script lang="ts" setup>
import { watch, computed } from "vue";
import { useZakenByZaaknummer } from "./service";
import type { Zaak } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ZakenOverzicht from "./ZakenOverzicht.vue";
import { ensureState } from "@/stores/create-store"; //todo: niet in de stores map. die is applicatie specifiek. dit is generieke functionaliteit
import { useContactmomentStore } from "@/stores/contactmoment";
import {
  UtrechtHeading,
  UtrechtIconLoupe,
} from "@utrecht/web-component-library-vue";

const contactmomentStore = useContactmomentStore();

const store = ensureState({
  stateId: "zaak-zoeker",
  stateFactory() {
    return {
      searchField: "",
      currentSearch: "",
    };
  },
});

const emit = defineEmits(["zaakSelected"]);

const zaakSelected = (zaak: Zaak) => {
  emit("zaakSelected", zaak);
};

const zaken = useZakenByZaaknummer(computed(() => store.value.currentSearch));

const zoekOpZaak = () => {
  store.value.currentSearch = store.value.searchField;
};

const singleZaak = computed(() =>
  zaken.success && zaken.data.page.length === 1 ? zaken.data.page[0] : undefined
);

watch(singleZaak, (n, o) => {
  if (n && n.id !== o?.id) {
    zaakSelected(n);
  }
});
</script>

<style lang="scss" scoped>
.search-bar {
  inline-size: min(100%, 20rem);
  margin-block-end: var(--spacing-large);
}

.resultaten-container {
  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }

  .resultaten-heading {
    padding-block-end: var(--spacing-default);
    border-bottom: 1px solid var(--color-tertiary);
  }

  .resultaten-found {
    color: var(--color-primary);
    padding-block-start: var(--spacing-small);
  }
}
</style>
