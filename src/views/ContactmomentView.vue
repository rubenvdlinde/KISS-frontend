<template>
  <main>
    <!-- todo: 'subviews' maken voor klanten en zaken, deze component wordt anders te groot. (aparte views is niet handig ivm navigatie)-->
    <!-- todo: 'trecht-heading errors irriteren. component verwijderen?-->

    <div class="tabs-component-contactmoment">
      <ul role="tablist" class="tabs-component-tabs">
        <li
          :class="{
            'is-active': activeTabContactmoment === tabsContactmoment.klanten,
          }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="true"
            @click.prevent="activeTabContactmoment = tabsContactmoment.klanten"
            >Klanten</a
          >
        </li>
        <li
          :class="{
            'is-active': activeTabContactmoment === tabsContactmoment.zaken,
          }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="false"
            @click.prevent="activeTabContactmoment = tabsContactmoment.zaken"
            >Zaken</a
          >
        </li>
      </ul>
      <div class="tabs-component-panels">
        <div v-if="activeTabContactmoment === tabsContactmoment.klanten">
          <utrecht-heading :level="2">Klanten</utrecht-heading>

          <klant-zoeker @onKlantSelected="setKlant"></klant-zoeker>
          <klant-details
            v-if="'er is een klant geselecteerd' != false"
          ></klant-details>
        </div>
        <div v-else>
          <utrecht-heading :level="2">Zaken</utrecht-heading>
          <div class="tabs-component-zaken">
            <ul role="tablist" class="tabs-component-tabs">
              <li
                :class="{ 'is-active': activeTab === tabs.personenZoeker }"
                class="tabs-component-tab"
                role="presentation"
              >
                <a
                  href=""
                  class="tabs-component-tab-a"
                  role="tab"
                  aria-selected="true"
                  @click.prevent="activeTab = tabs.personenZoeker"
                  >Personen</a
                >
              </li>
              <li
                :class="{ 'is-active': activeTab === tabs.zakenZoeker }"
                class="tabs-component-tab"
                role="presentation"
              >
                <a
                  href=""
                  class="tabs-component-tab-a"
                  role="tab"
                  aria-selected="false"
                  @click.prevent="activeTab = tabs.zakenZoeker"
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
                  v-if="activeTab === tabs.zakenZoeker"
                  :populatedBsn="curentBsn"
                ></zaak-zoeker>
                <persoon-zoeker
                  v-else
                  @zakenZoeken="onZakenZoeken"
                ></persoon-zoeker>
              </section>
            </div>
          </div>
        </div>
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

//layout view tabs
const tabsContactmoment = { klanten: "klanten", zaken: "zaken" };
const activeTabContactmoment = ref(tabsContactmoment.klanten);

//zaak tabs
const tabs = { zakenZoeker: "zakenZoeker", personenZoeker: "personenZoeker" };
const activeTab = ref(tabs.personenZoeker);
const curentBsn = ref<number>();

// er kan direct vanaf de personen tab gezocht worden naar de bijbehorende zaken.
// we swichen daarvoor naar de zakentab
const onZakenZoeken = (bsn: number) => {
  curentBsn.value = bsn;
  activeTab.value = tabs.zakenZoeker;
};

//klant functies
const setKlant = (klant: any) => {
  console.log(" klantselected", klant);
};
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
  padding-block: 0;
}

.tabs-component-tabs,
utrecht-heading,
.tabs-component-panels {
  padding-inline: var(--spacing-default);
  > div {
    padding: var(--spacing-default);
  }
}
</style>
