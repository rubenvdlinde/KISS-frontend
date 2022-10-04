<template>
  <section>
    <form class="search-bar" @submit.prevent="zoekOpZaak">
      <label>
        <input
          type="search"
          placeholder="Zoek op zaaknummer"
          v-model="store.zaakSearchParams.zaaknummer"
          title="0612345789 test@conduction.nl"
        />
      </label>
      <button title="Zoeken">
        <span>Zoeken</span><utrecht-icon-loupe model-value />
      </button>
    </form>

    <section class="resultaten-container" v-if="store.zaken.length > 0">
      <div class="resultaten-heading-container">
        <utrecht-heading class="resultaten-heading" :level="2" model-value
          >Zoekresultaten</utrecht-heading
        >

        <div class="resultaten-found">
          {{
            `${store.zaken.length} ${
              store.zaken.length > 1 ? "resultaten" : "resultaat"
            } gevonden`
          }}
        </div>
      </div>

      <zaken-overzicht
        :zaken="store.zaken"
        :vraag="contactmomentStore.huidigeVraag"
        @zaak-selected="zaakSelected"
      />
    </section>

    <application-message
      v-if="error"
      messageType="error"
      message="Er is een probleem opgetreden."
    ></application-message>

    <simple-spinner v-else-if="busy"></simple-spinner>

    <paragraph v-else-if="isDirty">Er zijn geen zaken gevonden.</paragraph>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useZaaksysteemService } from "./service";
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
      zaakSearchParams: { zaaknummer: "", bsn: "" },
      zaken: [] as Zaak[],
    };
  },
});

const emit = defineEmits(["zaakSelected"]);

const zaakSelected = (zaak: Zaak) => {
  emit("zaakSelected", zaak);
};

const service = useZaaksysteemService();

const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);

const zoekOpZaak = () => {
  busy.value = true;
  error.value = false;
  store.value.zaken = [];

  service
    .findByZaak(store.value.zaakSearchParams.zaaknummer)
    .then((data) => {
      store.value.zaken = data.page;
      isDirty.value = true;
    })
    .catch((e) => {
      error.value = true;
      console.error(e);
    })
    .finally(() => {
      busy.value = false;
    });
};

const singleZaak = computed(() =>
  store.value.zaken && store.value.zaken.length === 1
    ? store.value.zaken[0]
    : undefined
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
