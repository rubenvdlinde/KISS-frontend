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
        <zaak-contactmomenten
          v-if="contactmomenten.success"
          :contactmomenten="contactmomenten.data"
        />

        <simple-spinner v-if="contactmomenten.loading" />
      </template>
    </tabs-component>

    <div class="toelichting">
      <zaak-toelichting :zaak="zaak" />
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
import { useZaaksysteemService } from "@/features/zaaksysteem/service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const zaaksysteemService = useZaaksysteemService();
const contactmomenten = zaaksysteemService.getContactmomentenByZaak(
  props.zaak.self
);

const Tabs = computed(() => ({
  algemeen: "Algemeen",
  documenten: `Documenten (${props.zaak.documenten?.length ?? 0})`,
  contactmomenten: `Contactmomenten`,
}));

const activeTab = ref(Tabs.value.algemeen);
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
</style>
