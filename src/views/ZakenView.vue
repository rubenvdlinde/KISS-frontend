<template>
  <article>
    <utrecht-heading :level="1" model-value class="zaak-title">
      Zaken
    </utrecht-heading>
    <tabs-component v-model="activeTab" class="zaak-tabs">
      <template #[Tabs.personenZoeker]>
        <persoon-zoeker @zakenZoeken="onZakenZoeken" />
      </template>
      <template #[Tabs.zakenZoeker]>
        <zaak-zoeker
          :populatedBsn="currentBsn"
          @zaak-selected="handleZaakSelected"
        />
      </template>
    </tabs-component>
  </article>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import TabsComponent from "@/components/TabsComponent.vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { PersoonZoeker } from "@/features/brp";
import { ZaakZoeker } from "@/features/zaaksysteem";
import { useRouter } from "vue-router";
import type { Zaak } from "@/features/zaaksysteem/types";

//zaak tabs
enum Tabs {
  zakenZoeker = "Via zaaknummer",
  personenZoeker = "Via persoon",
}
const activeTab = ref(Tabs.personenZoeker);
const currentBsn = ref<string>();

const router = useRouter();

const handleZaakSelected = (zaak: Zaak) => {
  useContactmomentStore().addZaak(zaak);
  router.push({ name: "zaakDetail", params: { id: zaak.id } });
};

// er kan direct vanaf de personen tab gezocht worden naar de bijbehorende zaken.
// we swichen daarvoor naar de zakentab
const onZakenZoeken = (bsn: string) => {
  currentBsn.value = "";
  nextTick(() => {
    currentBsn.value = bsn;
    activeTab.value = Tabs.zakenZoeker;
  });
};
</script>

<style scoped lang="scss">
:deep([role="tablist"]),
.zaak-tabs :deep([role="tabpanel"]) {
  padding-inline: var(--spacing-extralarge);
}

:deep([role="tabpanel"]) {
  padding-block: var(--spacing-default);
}

.zaak-tabs {
  --tab-bg: var(--color-secondary);
  --tab-size: 1.25rem;
}
</style>
