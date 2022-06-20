<template>
  <main>
    <utrecht-heading :level="1">Contactmoment</utrecht-heading>
    <div class="tabs-component">
      <ul role="tablist" class="tabs-component-tabs">
        <li
          :class="{ 'is-active': activeTab === tabs.personenZoeker }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="true"
            @click.prevent="activeTab = tabs.personenZoeker"
            >Personen</a
          >
        </li>
        <li
          :class="{ 'is-active': activeTab === tabs.zakenZoeker }"
          class="tabs-component-tab"
          role="presentation"
        >
          <a
            href=""
            class="tabs-component-tab-a"
            role="tab"
            aria-selected="false"
            @click.prevent="activeTab = tabs.zakenZoeker"
            >Zaken</a
          >
        </li>
      </ul>
      <div class="tabs-component-panels">
        <section
          aria-hidden="true"
          class="tabs-component-panel"
          role="tabpanel"
        >
          <zaak-zoeker
            v-if="activeTab === tabs.zakenZoeker"
            :populatedBsn="curentBsn"
          ></zaak-zoeker>
          <persoon-zoeker v-else @zakenZoeken="onZakenZoeken"></persoon-zoeker>
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import ZaakZoeker from "../features/zaaksysteem/ZaakZoeker.vue";
import PersoonZoeker from "../features/brp/PersoonZoeker.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ref } from "vue";

const tabs = { zakenZoeker: "zakenZoeker", personenZoeker: "personenZoeker" };
const activeTab = ref(tabs.personenZoeker);
const curentBsn = ref<number>();

// er kan direct vanaf de personen tab gezocht worden naar de bijbehorende zaken.
// we swichen daarvoor naar de zakentab
const onZakenZoeken = (bsn: number) => {
  curentBsn.value = bsn;
  activeTab.value = tabs.zakenZoeker;
};
</script>

<style scoped lang="scss">
main {
  padding-inline: 0;
}

.tabs-component-tabs,
utrecht-heading,
.tabs-component-panels {
  padding-inline: var(--container-padding);
}
</style>
