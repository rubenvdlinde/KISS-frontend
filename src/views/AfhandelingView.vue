<template>
  <main>
    <utrecht-heading :level="1">Afhandeling</utrecht-heading>
    <router-link
      v-if="contactmoment.contactmomentLoopt"
      :to="{ name: 'contactmoment' }"
      >terug</router-link
    >
    <section class="layoutcontainer-small">
      <contactmoment-afhandel-form />
    </section>
  </main>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ContactmomentAfhandelForm } from "@/features/contactmoment";
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmoment = useContactmomentStore();
</script>

<style scoped lang="scss">
.layoutcontainer-small {
  max-width: 40rem;
}
</style>
