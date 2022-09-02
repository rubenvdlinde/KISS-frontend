<template>
  <!-- todo: 'subviews' maken voor klanten en zaken, deze component wordt anders te groot. (aparte views is niet handig ivm navigatie)-->
  <!-- todo: 'trecht-heading errors irriteren. component verwijderen?-->
  <tabs-component v-model="activeTabContactmoment" class="main-tabs">
    <!-- KLANTEN -->
    <template #[TabsContactmoment.klanten]>
      <article class="klant-panel" v-show="showKlantenSearch">
        <utrecht-heading :level="1" model-value>Klanten</utrecht-heading>
        <klant-zoeker @klant-selected="klantGevonden" />
      </article>
      <article
        class="klant-panel"
        v-show="!showKlantenSearch && contactmomentStore.klant"
      >
        <utrecht-heading :level="1" model-value
          >Klantinformatie</utrecht-heading
        >
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

    <!-- ZAKEN -->
    <template #[TabsContactmoment.zaken]>
      <article>
        <utrecht-heading :level="1" model-value class="zaak-title">
          Zaken
        </utrecht-heading>
        <tabs-component v-model="activeTab" class="zaak-tabs">
          <template #[Tabs.personenZoeker]>
            <persoon-zoeker @zakenZoeken="onZakenZoeken" />
          </template>
          <template #[Tabs.zakenZoeker]>
            <zaak-zoeker :populatedBsn="currentBsn" />
          </template>
        </tabs-component>
      </article>
    </template>
  </tabs-component>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import TabsComponent from "@/components/TabsComponent.vue";
import { useContactmomentStore, type Klant } from "@/stores/contactmoment";
import { PersoonZoeker } from "@/features/brp";
import { ContactmomentenOverzicht } from "@/features/contactmoment";
import { KlantZoeker, KlantDetails } from "@/features/klant";
import { ZaakZoeker } from "@/features/zaaksysteem";
import ZakenOverzichtKlantbeeld from "../features/zaaksysteem/ZakenOverzichtKlantbeeld.vue";

//layout view tabs
enum TabsContactmoment {
  klanten = "Klanten",
  zaken = "Zaken",
}
const activeTabContactmoment = ref(TabsContactmoment.klanten);

//zaak tabs
enum Tabs {
  zakenZoeker = "Via zaaknummer",
  personenZoeker = "Via persoon",
}
const activeTab = ref(Tabs.personenZoeker);
const currentBsn = ref<string>();

// er kan direct vanaf de personen tab gezocht worden naar de bijbehorende zaken.
// we swichen daarvoor naar de zakentab
const onZakenZoeken = (bsn: string) => {
  currentBsn.value = "";
  nextTick(() => {
    currentBsn.value = bsn;
    activeTab.value = Tabs.zakenZoeker;
  });
};

//klant functies
const showKlantenSearch = ref(true);
const contactmomentStore = useContactmomentStore();

const klantGevonden = (klant: Klant) => {
  showKlantenSearch.value = false;
  contactmomentStore.setKlant(klant);
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
  grid-column: 2 / 5;

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
