<template>
  <the-toast-section />
  <div
    :class="[
      'app-layout',
      {
        'contactmoment-loopt': contactmomentStore.contactmomentLoopt,
        'hide-sidebar': route.meta.hideSidebar,
      },
    ]"
  >
    <the-header />
    <the-sidebar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterView, useRoute } from "vue-router";
import { useContactmomentStore } from "@/stores/contactmoment";
import TheToastSection from "@/components/TheToastSection.vue";
import TheSidebar from "./layout/TheSidebar.vue";
import TheHeader from "./layout/TheHeader.vue";

const contactmomentStore = useContactmomentStore();
const route = useRoute();
</script>

<style lang="scss">
/* Design Tokens */
@import "@gemeente-denhaag/design-tokens-components/dist/index.css";
@import "@/assets/design-tokens.scss";

@import "@/assets/reset.css";
@import "@/assets/fonts/fonts.css";
@import "@/assets/main.scss";
@import "@/assets/icons/icons.scss";
@import "@utrecht/component-library-css";
</style>
