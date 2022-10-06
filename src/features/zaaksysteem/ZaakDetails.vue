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

      <template #[Tabs.contactmomenten]>
        <zaak-contactmomenten :zaak="zaak" />
      </template>
    </tabs-component>

    <div class="toelichting">
      <zaak-toelichting :zaak="zaak" @zaak-updated="bubbleZaakUpdated" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import type { ZaakDetails } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import ZaakToelichting from "./components/ZaakToelichting.vue";
import TabsComponent from "../../components/TabsComponent.vue";
import ZaakAlgemeen from "./components/ZaakAlgemeen.vue";
import ZaakDocumenten from "./components/ZaakDocumenten.vue";
import ZaakContactmomenten from "./components/ZaakContactmomenten.vue";

defineProps<{
  zaak: ZaakDetails;
}>();

const emit = defineEmits(["zaakUpdated"]);
const bubbleZaakUpdated = () => {
  emit("zaakUpdated");
};

const Tabs = computed(() => ({
  algemeen: "Algemeen",
  documenten: "Documenten",
  contactmomenten: "Contactmomenten",
}));

const activeTab = ref(Tabs.value.algemeen);
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
