<template>
  <article>
    <simple-spinner v-if="zaak.loading || contactmomenten.loading" />

    <application-message
      v-if="zaak.error || contactmomenten.error"
      messageType="error"
      message="Er kon geen zaak gevonden worden"
    ></application-message>

    <zaak-details
      :contactmomenten="contactmomenten.data"
      :zaak="zaak.data"
      v-if="zaak.success && contactmomenten.success"
    />
  </article>
</template>

<script setup lang="ts">
import { useZaaksysteemService } from "@/features/zaaksysteem/service";
import ApplicationMessage from "../components/ApplicationMessage.vue";
import ZaakDetails from "../features/zaaksysteem/ZaakDetails.vue";
import { useRoute } from "vue-router";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const route = useRoute();

const zaaksysteemService = useZaaksysteemService();

const zaak = zaaksysteemService.getZaak(route.params.id.toString());

const contactmomenten = zaaksysteemService.getContactmomentenByZaak(
  route.params.id.toString()
);
</script>

<style scoped lang="scss"></style>
