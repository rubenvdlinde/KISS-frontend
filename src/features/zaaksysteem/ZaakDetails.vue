<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1" model-value
        >Zaak {{ zaak.identificatie }}
      </utrecht-heading>
      <router-link :to="{ name: 'zaken' }">{{ "< Ga terug" }}</router-link>
    </div>

    <tabs-component v-model="activeTab">
      <template #[Tabs.algemeen]> Algemeen </template>
      <template #[Tabs.documenten]> Documenten </template>
      <template #[Tabs.betrokkenen]> Betrokkenen </template>
      <template #[Tabs.contactmomenten]> Contactmomenten </template>
      <template #[Tabs.historie]> Historie </template>
      <template #[Tabs.locatie]> Locatie </template>
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
