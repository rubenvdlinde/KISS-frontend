<template>
  <utrecht-heading :level="1">Contactmoment</utrecht-heading>

  <div class="tabs-component">
    <ul role="tablist" class="tabs-component-tabs">
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
      <li
        :class="{ 'is-active': activeTab === tabs.personenZoeker }"
        class="tabs-component-tab"
        role="presentation"
      >
        <a
          href=""
          class="tabs-component-tab-a is-active"
          role="tab"
          aria-selected="true"
          @click.prevent="activeTab = tabs.personenZoeker"
          >Personen</a
        >
      </li>
    </ul>
    <div class="tabs-component-panels">
      <section aria-hidden="true" class="tabs-component-panel" role="tabpanel">
        <zaak-zoeker
          v-if="activeTab === tabs.zakenZoeker"
          :populatedBsn="curentBsn"
        ></zaak-zoeker>
        <persoon-zoeker v-else @zakenZoeken="onZakenZoeken"></persoon-zoeker>
      </section>
    </div>
  </div>

  <!-- <tabs :options="{ useUrlFragment: false, defaultTabHash: xx }" :key="tabsKey">
    <tab id="bbb" name="Zaken"><zaak-zoeker></zaak-zoeker></tab>
    <tab id="aa" name="Personen"
      ><persoon-zoeker @zakenZoeken="onZakenZoeken"></persoon-zoeker
    ></tab>
  </tabs> -->

  <contactmoment-starter />
</template>

<script setup lang="ts">
import ContactmomentStarter from "../features/contactmoment/ContactmomentStarter.vue";
import ZaakZoeker from "../features/zaaksysteem/ZaakZoeker.vue";
import PersoonZoeker from "../features/brp/PersoonZoeker.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

//import { Tabs, Tab } from "vue3-tabs-component";
import { ref } from "vue";

const tabs = { zakenZoeker: "zakenZoeker", personenZoeker: "personenZoeker" };
const activeTab = ref(tabs.personenZoeker);
const curentBsn = ref<number>();
const onZakenZoeken = (bsn: number) => {
  curentBsn.value = bsn;
  activeTab.value = tabs.zakenZoeker;
};
</script>

<style scoped lang="scss"></style>
