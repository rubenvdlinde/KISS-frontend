<template>
  <main>
    <!-- todo: 'subviews' maken voor klanten en zaken, deze component wordt anders te groot. (aparte views is niet handig ivm navigatie)-->
    <!-- todo: 'trecht-heading errors irriteren. component verwijderen?-->
    <tabs-component v-model="activeTabContactmoment" class="main-tabs">
      <template #[TabsContactmoment.klanten]>
        <article class="klant-panel">
          <utrecht-heading :level="1" model-value>Klanten</utrecht-heading>
          <klant-zoeker
            v-if="showKlantenSearch"
            @onKlantSelected="klantGevonden"
          />
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
            <klant-details :klant="contactmomentStore.klant" />
          </template>
        </article>
      </template>
      <template #[TabsContactmoment.zaken]>
        <section>
          <utrecht-heading :level="1" model-value class="zaak-title">
            Zaken
          </utrecht-heading>
          <tabs-component v-model="activeTab" class="zaak-tabs">
            <template #[Tabs.personenZoeker]>
              <persoon-zoeker @zakenZoeken="onZakenZoeken" />
            </template>
            <template #[Tabs.zakenZoeker]>
              <zaak-zoeker :populatedBsn="curentBsn" />
            </template>
          </tabs-component>
        </section>
      </template>
    </tabs-component>
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
import TabsComponent from "@/components/TabsComponent.vue";

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

.zaak-title {
  margin-inline: var(--container-padding);
}

::v-deep {
  [role="tablist"],
  .zaak-tabs [role="tabpanel"] {
    padding-inline: var(--container-padding);
  }

  [role="tabpanel"] {
    padding-block: var(--spacing-default);
  }
}

.klant-panel {
  margin-inline: var(--container-padding);
}

.main-tabs {
  --tab-bg: white;
  background-color: var(--color-secondary);
}

.zaak-tabs {
  --tab-bg: var(--color-secondary);
}
</style>
