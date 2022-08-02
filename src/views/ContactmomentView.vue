<template>
  <main>
    <aside>
      <menu></menu>
      <section>
        <!-- <textarea
            ref="notitieRef"
            @change="notitieChanged"
            v-model="contactmomentStore.notitie"
          >
          </textarea> -->
        <contactmoment-notitie></contactmoment-notitie>
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
          <simple-spinner v-if="contactmomenten.loading" />
          <template v-if="contactmomenten.success">
            <utrecht-heading
              class="contactmomenten-header"
              model-value
              :level="2"
            >
              Contactmomenten
            </utrecht-heading>
            <contactmomenten-overzicht
              :contactmomenten="contactmomenten.data.page"
            />
          </template>
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
  useKlantContactmomenten,
} from "@/features/contactmoment";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ref, computed, onMounted } from "vue";
import { KlantZoeker, KlantDetails } from "@/features/klant";
import { useContactmomentStore, type Klant } from "@/stores/contactmoment";
import TabsComponent from "@/components/TabsComponent.vue";
import { ZaakZoeker } from "@/features/zaaksysteem";
import { toast } from "@/stores/toast";
import SimpleSpinner from "../components/SimpleSpinner.vue";
import ContactmomentNotitie from "@/features/notitie/ContactmomentNotitie.vue";

// const notitieRef = ref();

// onMounted(() => {
//   notitieRef.value.focus();
// });

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
  toast({ text: "Klant gekoppeld aan contactmoment" });
};

const klantId = computed(() => contactmomentStore.klant?.id || "");

const contactmomenten = useKlantContactmomenten(klantId);

// const notitieChanged = (element: any) => {
//   contactmomentStore.setNotitie(element.target.value);
// };
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
  padding-block: 0;
  display: grid;
  grid-template-columns: 1fr 4fr;
  height: 100%;
}

aside section {
  border-right: 1px solid var(--color-tertiary);
  height: 100%;
  padding: var(--spacing-large);
}
menu {
  height: 3rem;
  background-color: var(--color-tertiary);
}

// aside section div {
//   width: 100%;
//   height: 100%;
// }

// aside section textarea {
//   border: none;
//   width: 100%;
//   height: 100%;
//   outline: none;
// }

.zaak-title {
  margin-inline: var(--container-padding);
}

:deep([role="tablist"]),
.zaak-tabs :deep([role="tabpanel"]) {
  padding-inline: var(--spacing-extralarge);
}

:deep([role="tabpanel"]) {
  padding-block: var(--spacing-default);
}

.klant-panel {
  margin-inline: var(--spacing-extralarge);
}

.main-tabs {
  --tab-bg: white;
}

// .main-tabs article {
//   // height: 100%;
// }

.zaak-tabs {
  --tab-bg: var(--color-secondary);
  --tab-size: 1.25rem;
}

.contactmomenten-header {
  margin-inline-start: var(--spacing-default);
}
</style>
