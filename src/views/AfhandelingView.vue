<template>
  <utrecht-heading :level="1">Afhandeling</utrecht-heading>
  <section class="layoutcontainer-small">
    <contactmoment-afhandel-form />
  </section>
  <contactmoment-starter v-if="!contactmoment.contactmomentLoopt" />
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import {
  ContactmomentAfhandelForm,
  ContactmomentStarter,
} from "@/features/contactmoment";
//import ContactmomentStarter from "@/features/contactmoment/ContactmomentStarter.vue";
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmoment = useContactmomentStore();
</script>

<style scoped lang="scss">
.layoutcontainer-small {
  max-width: 40rem;
}
</style>
