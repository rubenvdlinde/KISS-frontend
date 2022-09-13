<template>
  <article>
    <simple-spinner v-if="zaak.loading" />

    <application-message
      v-if="zaak.error"
      messageType="error"
      message="Er kon geen zaak gevonden worden"
    ></application-message>

    <zaak-details :zaak="zaak.data" v-if="zaak.success" />
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
</script>

<style scoped lang="scss"></style>
