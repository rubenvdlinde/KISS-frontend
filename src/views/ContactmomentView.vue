<template>
  <utrecht-heading :level="1">Contactmoment</utrecht-heading>

    <zaak-zoeker></zaak-zoeker>

  <contactmoment-starter />
</template>

<script setup lang="ts">
import ContactmomentStarter from "../features/contactmoment/ContactmomentStarter.vue";
import ZaakZoeker from "../features/zaaksysteem/ZaakZoeker.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

</script>

<style scoped lang="scss">

</style>
