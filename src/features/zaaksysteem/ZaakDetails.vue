<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1" model-value
        >Zaak {{ zaak.identificatie }}
      </utrecht-heading>
      <router-link :to="{ name: 'zaken' }">{{ "< Ga terug" }}</router-link>
    </div>

    <tabs-component v-model="activeTab">
      <template #[Tabs.algemeen]>
        <zaak-algemeen :zaak="zaak" />
      </template>

      <template #[Tabs.documenten]>
        <zaak-documenten :zaak="zaak" />
      </template>

      <template #[Tabs.betrokkenen]>
        <zaak-betrokkenen :zaak="zaak" />
      </template>

      <template #[Tabs.contactmomenten]>
        <zaak-contactmomenten :zaak="zaak" />
      </template>

      <template #[Tabs.historie]>
        <zaak-historie :zaak="zaak" />
      </template>

      <template #[Tabs.locatie]>
        <zaak-locatie :zaak="zaak" />
      </template>
    </tabs-component>

    <div class="toelichting">
      <zaak-toelichting :zaak="zaak" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { ZaakDetails } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import ZaakToelichting from "./components/ZaakToelichting.vue";
import TabsComponent from "../../components/TabsComponent.vue";
import ZaakAlgemeen from "./components/ZaakAlgemeen.vue";
import ZaakDocumenten from "./components/ZaakDocumenten.vue";
import ZaakBetrokkenen from "./components/ZaakBetrokkenen.vue";
import ZaakHistorie from "./components/ZaakHistorie.vue";
import ZaakLocatie from "./components/ZaakLocatie.vue";
import ZaakContactmomenten from "./components/ZaakContactmomenten.vue";

defineProps<{
  zaak: ZaakDetails;
}>();

enum Tabs {
  algemeen = "Algemeen",
  documenten = "Documenten",
  betrokkenen = "Betrokkenen",
  contactmomenten = "Contactmomenten",
  historie = "Historie",
  locatie = "Locatie",
}
const activeTab = ref(Tabs.algemeen);

</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
.notes {
  gap: var(--spacing-large);
  display: flex;

  .current-notes {
    flex: 3;
  }

  .new-note {
    flex: 2;
  }
}

.new-note {
  > *:not(:last-child) {
    margin-block-end: var(--spacing-small);
  }

  menu {
    display: flex;
    gap: var(--spacing-small);
    float: right;
  }
}

.toelichting-heading {
  display: flex;

  button {
    all: unset;
    margin-inline-start: var(--spacing-default);

    &:hover {
      cursor: pointer;
    }
  }
}

.spinner {
  font-size: 16px;
  margin-inline-start: var(--spacing-default);
}
</style>
