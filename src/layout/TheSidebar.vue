<template>
  <aside>
    <menu class="starter" v-if="route.meta.showSearch">
      <li>
        <contactmoment-starter />
      </li>
    </menu>
    <template
      v-if="contactmomentStore.contactmomentLoopt && route.meta.showNotitie"
    >
      <section class="within-moment">
        <h2>Vragen</h2>
        <contactmoment-vragen-menu />
        <tabs-component v-model="state.currentNotitieTab" class="notitie-tabs">
          <template #tab="{ tabName }">
            <span
              :title="tabName"
              :class="[
                'icon-after',
                tabName === NotitieTabs.Terugbel ? 'phone-flip' : 'note',
              ]"
            ></span>
          </template>
          <template #[NotitieTabs.Regulier]>
            <utrecht-heading id="notitieblok" model-value :level="2"
              >Notitieblok</utrecht-heading
            >
            <textarea
              aria-labelledby="notitieblok"
              v-focus
              class="utrecht-textarea"
              v-model="contactmomentStore.huidigeVraag.notitie"
            />
          </template>
          <template #[NotitieTabs.Terugbel]>
            <p v-if="contactverzoekIsSentToMedewerker">
              Contactverzoek verstuurd naar
              {{ contactverzoekIsSentToMedewerker }}
            </p>
            <ContactverzoekFormulier
              :huidige-vraag="contactmomentStore.huidigeVraag"
              :huidige-klant="contactmomentStore.klantVoorHuidigeVraag"
              @start="handleContactverzoekStart"
              @submit="handleContactverzoekSubmit"
            />
          </template>
        </tabs-component>
      </section>
    </template>
  </aside>
</template>

<script lang="ts" setup>
import { ContactverzoekFormulier } from "@/features/contactverzoek";
import TabsComponent from "@/components/TabsComponent.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import ContactmomentVragenMenu from "@/features/contactmoment/ContactmomentVragenMenu.vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { ensureState } from "@/stores/create-store";
import { watch, computed } from "vue";
import { useRoute } from "vue-router";
import ContactmomentStarter from "../features/contactmoment/ContactmomentStarter.vue";

enum NotitieTabs {
  Regulier = "Reguliere notitie",
  Terugbel = "Contactverzoek",
}

const contactmomentStore = useContactmomentStore();
const route = useRoute();

const state = ensureState({
  stateId: "Sidebar",
  stateFactory() {
    return {
      currentNotitieTab: NotitieTabs.Regulier,
    };
  },
});

watch(
  () => contactmomentStore.huidigeVraag,
  () => {
    state.reset();
  }
);

const contactverzoekIsSentToMedewerker = computed(
  () => contactmomentStore.huidigeVraag.contactverzoek.medewerker
);

const handleContactverzoekStart = () => {
  contactmomentStore.huidigeVraag.contactverzoek.isInProgress = true;
};

const handleContactverzoekSubmit = ({
  medewerker,
  url,
}: {
  medewerker: string;
  url: string;
}) => {
  const { contactverzoek } = contactmomentStore.huidigeVraag;
  contactverzoek.url = url;
  contactverzoek.medewerker = medewerker;
  contactverzoek.isSubmitted = true;
  contactverzoek.isInProgress = false;
};
</script>

<style lang="scss" scoped>
aside {
  background-color: var(--sidebar-color-1);
  padding-inline: 2px;
  display: flex;
  flex-direction: column;

  textarea.utrecht-textarea {
    margin-block-start: var(--spacing-default);
    padding: 0px;
    border: none;
    outline: none;
    flex: 1;
    resize: none;
  }

  [role="tablist"] {
    height: 3rem;
  }
}

.notitie-tabs {
  margin-block-start: var(--spacing-small);

  --tab-bg: var(--color-white);

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
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }
}

.starter {
  align-self: center;
  margin-block-start: 4rem;
  margin-block-end: var(--spacing-default);
}

.within-moment {
  display: flex;
  flex-direction: column;
  flex: 1;
  background-color: var(--sidebar-color-2);
  border-start-start-radius: var(--radius-large);
  border-start-end-radius: var(--radius-large);
  color: var(--color-headings);
  margin-block-start: var(--spacing-large);

  h2 {
    margin-block-start: var(--spacing-small);
    margin-inline: var(--spacing-default);
    color: inherit;
  }
}
</style>
