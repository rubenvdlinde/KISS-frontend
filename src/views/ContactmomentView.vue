<template>
  <main>
    <aside>
      <menu></menu>
      <section>
        <contactmoment-notitie
          class="notitie utrecht-textarea"
        ></contactmoment-notitie>
      </section>
    </aside>

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
              <zaak-zoeker :populatedBsn="curentBsn" />
            </template>
          </tabs-component>
        </article>
      </template>
    </tabs-component>
  </main>
  <contactmoment-starter />
</template>

<script setup lang="ts">
import PersoonZoeker from "@/features/brp/PersoonZoeker.vue";
import {
  ContactmomentStarter,
  ContactmomentenOverzicht,
  ContactmomentNotitie,
} from "@/features/contactmoment";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ref, computed } from "vue";
import { KlantZoeker, KlantDetails } from "@/features/klant";
import { useContactmomentStore, type Klant } from "@/stores/contactmoment";
import TabsComponent from "@/components/TabsComponent.vue";
import { ZaakZoeker } from "@/features/zaaksysteem";

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

const klantGevonden = (klant: Klant) => {
  showKlantenSearch.value = false;
  contactmomentStore.setKlant(klant);
};

const klantId = computed(() => contactmomentStore.klant?.id || "");
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
  padding-block: 0;
  display: grid;
  grid-template-columns: 1fr 4fr;
  height: 100vh;
}

aside {
  section {
    border-right: 1px solid var(--color-tertiary);
    height: 100%;
    padding: var(--spacing-large);

    :deep(textarea.utrecht-textarea) {
      padding: 0px;
    }
  }

  menu {
    height: 3rem;
    background-color: var(--color-tertiary);
  }
}

aside section .zaak-title {
  margin-inline: var(--container-padding);
}

:deep([role="tablist"]),
.zaak-tabs :deep([role="tabpanel"]) {
  padding-inline: var(--spacing-extralarge);
}

:deep([role="tabpanel"]) {
  padding-block: var(--spacing-default);
}

.main-tabs {
  --tab-bg: white;

  ul li article {
    margin-inline: var(--spacing-extralarge);
  }
}

.zaak-tabs {
  --tab-bg: var(--color-secondary);
  --tab-size: 1.25rem;
}

.contactmomenten-header {
  margin-inline-start: var(--spacing-default);
}

:deep(.notitie) {
  margin-top: var(--spacing-large);
  outline: none;
  border: none;
  height: 100%;
  width: 100%;
}
</style>
