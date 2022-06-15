<template>
  <utrecht-heading :level="1">Contactmoment</utrecht-heading>

  <tabs :options="{ useUrlFragment: false }" @changed="tabChanged">
    <tab name="Zaken"><zaak-zoeker></zaak-zoeker></tab>
    <tab name="Personen"><persoon-zoeker></persoon-zoeker></tab>
  </tabs>

  <contactmoment-starter />
</template>

<script setup lang="ts">
import ContactmomentStarter from "../features/contactmoment/ContactmomentStarter.vue";
import ZaakZoeker from "../features/zaaksysteem/ZaakZoeker.vue";
import PersoonZoeker from "../features/brp/PersoonZoeker.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { Tabs, Tab } from "vue3-tabs-component";

const tabChanged = (x: any) => console.log(x);
</script>

<style scoped lang="scss"></style>
