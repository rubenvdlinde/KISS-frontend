<template>
  <main>
    <!-- todo: 'subviews' maken voor klanten en zaken, deze component wordt anders te groot. (aparte views is niet handig ivm navigatie)-->
    <!-- todo: 'trecht-heading errors irriteren. component verwijderen?-->

    <div class="tabs-component-contactmoment">
      <div class="tabs-component-tabs-background"></div>
      <ul role="tablist" class="tabs-component-tabs">
        <li
          :class="{
            'is-active': activeTabContactmoment === TabsContactmoment.klanten,
          }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="true"
            @click.prevent="activeTabContactmoment = TabsContactmoment.klanten"
            >Klanten</a
          >
        </li>
        <li
          :class="{
            'is-active': activeTabContactmoment === TabsContactmoment.zaken,
          }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="false"
            @click.prevent="activeTabContactmoment = TabsContactmoment.zaken"
            >Zaken</a
          >
        </li>
      </ul>
      <div class="tabs-component-panels">
        <article v-show="activeTabContactmoment === TabsContactmoment.klanten">
          <utrecht-heading :level="2" model-value>Klanten</utrecht-heading>

          <klant-zoeker
            v-if="showKlantenSearch"
            @onKlantSelected="klantGevonden"
          ></klant-zoeker>
          <template v-else-if="contactmomentStore.klant">
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
            <klant-details :klant="contactmomentStore.klant"></klant-details>
          </template>
        </article>
        <article v-show="activeTabContactmoment === TabsContactmoment.zaken">
          <utrecht-heading :level="2" model-value>Zaken</utrecht-heading>
          <div class="tabs-component-zaken">
            <ul role="tablist" class="tabs-component-tabs">
              <li
                :class="{ 'is-active': activeTab === Tabs.personenZoeker }"
                class="tabs-component-tab"
                role="presentation"
              >
                <a
                  href=""
                  class="tabs-component-tab-a"
                  role="tab"
                  aria-selected="true"
                  @click.prevent="activeTab = Tabs.personenZoeker"
                  >Personen</a
                >
              </li>
              <li
                :class="{ 'is-active': activeTab === Tabs.zakenZoeker }"
                class="tabs-component-tab"
                role="presentation"
              >
                <a
                  href=""
                  class="tabs-component-tab-a"
                  role="tab"
                  aria-selected="false"
                  @click.prevent="activeTab = Tabs.zakenZoeker"
                  >Zaken</a
                >
              </li>
            </ul>
            <div class="tabs-component-panels">
              <section
                aria-hidden="true"
                class="tabs-component-panel"
                role="tabpanel"
              >
                <zaak-zoeker
                  v-show="activeTab === Tabs.zakenZoeker"
                  :populatedBsn="curentBsn"
                ></zaak-zoeker>
                <persoon-zoeker
                  v-show="activeTab === Tabs.personenZoeker"
                  @zakenZoeken="onZakenZoeken"
                ></persoon-zoeker>
              </section>
            </div>
          </div>
        </article>
      </div>
    </div>
  </main>
  <contactmoment-starter />
</template>

<script setup lang="ts">
import ZaakZoeker from "@/features/zaaksysteem/ZaakZoeker.vue";
import PersoonZoeker from "@/features/brp/PersoonZoeker.vue";
import { ContactmomentStarter } from "@/features/contactmoment";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ref } from "vue";

import KlantZoeker from "@/features/klant/KlantZoeker.vue";
import KlantDetails from "@/features/klant/KlantDetails.vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import type { Klant } from "@/stores/contactmoment/types";

//layout view tabs
enum TabsContactmoment {
  klanten = "klanten",
  zaken = "zaken",
}
const activeTabContactmoment = ref(TabsContactmoment.klanten);

//zaak tabs
enum Tabs {
  zakenZoeker = "zakenZoeker",
  personenZoeker = "personenZoeker",
}
const activeTab = ref(Tabs.personenZoeker);
const curentBsn = ref<number>();

// er kan direct vanaf de personen tab gezocht worden naar de bijbehorende zaken.
// we swichen daarvoor naar de zakentab
const onZakenZoeken = (bsn: number) => {
  curentBsn.value = bsn;
  activeTab.value = Tabs.zakenZoeker;
};

//klant functies
const showKlantenSearch = ref(true);
const contactmomentStore = useContactmomentStore();

const klantGevonden = (klant: unknown) => {
  showKlantenSearch.value = false;
  contactmomentStore.setKlant(klant as Klant);
};
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
  padding-block: 0;
}

.tabs-component-contactmoment {
  display: grid;
  grid-template-columns: 1fr 10fr 1fr;
  grid-template-rows: 3.2rem 1fr;
  row-gap: var(--spacing-large);
}

.tabs-component-tabs {
  grid-column: 2;
  grid-row: 1;
}

.tabs-component-panels {
  grid-column: 2;
  grid-row: 2;
}

.tabs-component-tabs-background {
  grid-column: 1/-1;
  grid-row: 1;
  background-color: var(--color-secondary);
}

.tabs-component-panels utrecht-heading {
  margin-block-end: var(--spacing-default);
}
</style>
