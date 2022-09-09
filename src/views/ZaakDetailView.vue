<template>
  <article>
    <utrecht-heading :level="1" model-value>Zaak</utrecht-heading>
    <nav>
      <li>
        <router-link
          :to="{ name: 'zaken' }"
          class="utrecht-button utrecht-button--secondary-action"
          >Zaken zoeken</router-link
        >
      </li>
    </nav>

    <simple-spinner v-if="zaak.loading" />
    <zaak-details :zaak="zaak.data" v-if="zaak.success" />
    <application-message
      v-if="zaak.error"
      messageType="error"
      message="Er kon geen zaak gevonden worden"
    ></application-message>
  </article>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useZaaksysteemService } from "@/features/zaaksysteem/service";
import ApplicationMessage from "../components/ApplicationMessage.vue";
import ZaakDetails from "../features/zaaksysteem/ZaakDetails.vue";
import { useRoute } from "vue-router";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const route = useRoute();

const zaaksysteemService = useZaaksysteemService();

const zaak = zaaksysteemService.getZaak(route.params.id.toString());
</script>

<style scoped lang="scss">
nav {
  list-style: none;
  a {
    text-decoration: none;
  }
}
</style>
