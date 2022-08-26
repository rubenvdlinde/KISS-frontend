<template>
  <main>
    <aside>
      <menu></menu>
      <tabs-component v-model="currentNotitieTab" class="notitie-tabs">
        <template #tab="{ tabName }">
          <span
            :title="tabName"
            :class="[
              'icon-after',
              tabName === NotitieTabs.Terugbel ? 'phone-flip' : 'note',
            ]"
            >{{ tabName }}</span
          >
        </template>
        <template #[NotitieTabs.Regulier]>
          <contactmoment-notitie
            class="notitie utrecht-textarea"
          ></contactmoment-notitie>
        </template>
        <template #[NotitieTabs.Terugbel]>
          <contactverzoek-formulier @isDirty="handleContactverzoekIsDirty" />
        </template>
      </tabs-component>
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
  </main>
  <contactmoment-starter
    :beforeStopWarning="
      contactverzoekIsDirty
        ? 'Let op, u heeft een contactverzoek niet afgerond. Als u dit contactmoment afsluit wordt het contactverzoek niet verstuurt.'
        : ''
    "
  />
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import TabsComponent from "@/components/TabsComponent.vue";
import { useContactmomentStore, type Klant } from "@/stores/contactmoment";
import { PersoonZoeker } from "@/features/brp";
import {
  ContactmomentStarter,
  ContactmomentenOverzicht,
  ContactmomentNotitie,
} from "@/features/contactmoment";
import { KlantZoeker, KlantDetails } from "@/features/klant";
import { ZaakZoeker } from "@/features/zaaksysteem";
import { ContactverzoekFormulier } from "@/features/contactverzoek";
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

// sidebar
enum NotitieTabs {
  Regulier = "Reguliere notitie",
  Terugbel = "Contactverzoek",
}
const currentNotitieTab = ref(NotitieTabs.Regulier);

const disableContactmomentStarter = computed(() => {
  if (currentNotitieTab.value === NotitieTabs.Regulier) return false;
  return !contactmomentStore.contactverzoek;
});

const contactverzoekIsDirty = ref(false);

const handleContactverzoekIsDirty = (isDirty: boolean) => {
  contactverzoekIsDirty.value = isDirty;
};
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
  padding-block: 0;
  display: grid;
  grid-template-columns: 1fr 4fr;
}

aside {
  background-color: var(--color-tertiary);
  padding-inline: 2px;
  display: grid;
  grid-template-rows: auto 1fr;

  :deep(textarea.utrecht-textarea) {
    padding: 0px;
  }

  menu {
    background-color: var(--color-tertiary);
  }

  menu,
  :deep([role="tablist"]) {
    height: 3rem;
  }
}

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
  --tab-bg: white;

  ul li > article {
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
  width: 100%;
}

.icon-after {
  font-size: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.notitie-tabs {
  --tab-bg: white;

  :deep([role="tablist"]) {
    padding: 0;
    justify-items: stretch;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  :deep([role="tabpanel"]) {
    padding: var(--spacing-default);
    display: flex;
    flex-direction: column;
  }

  :deep([role="tab"]) {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;

    &[aria-selected="true"] {
      color: var(--color-tertiary);
    }
  }
}
</style>
