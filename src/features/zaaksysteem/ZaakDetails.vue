<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1"
        >Zaak {{ zaak.identificatie }}
      </utrecht-heading>
      <router-link :to="{ name: 'zaken' }">{{ "< Zaken zoeken" }}</router-link>
    </div>

    <tabs-component v-model="activeTab">
      <template #[Tabs.algemeen]>
        <zaak-algemeen :zaak="zaak" />
      </template>

      <template #[Tabs.documenten]>
        <zaak-documenten :zaak="zaak" />
      </template>

      <template #[Tabs.contactmomenten]>
        <zaak-contactmomenten :self="zaak.self" />
      </template>
    </tabs-component>

    <div class="toelichting">
      <zaak-toelichting :zaak="zaak" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { ZaakDetails } from "./types";
import { Heading as UtrechtHeading } from "@utrecht/component-library-vue";
import ZaakToelichting from "./components/ZaakToelichting.vue";
import TabsComponent from "../../components/TabsComponent.vue";
import ZaakAlgemeen from "./components/ZaakAlgemeen.vue";
import ZaakDocumenten from "./components/ZaakDocumenten.vue";
import ZaakContactmomenten from "./components/ZaakContactmomenten.vue";

defineProps<{
  zaak: ZaakDetails;
}>();

const Tabs = {
  algemeen: "Algemeen",
  documenten: "Documenten",
  contactmomenten: "Contactmomenten",
} as const;

const activeTab = ref(Tabs.algemeen);
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
