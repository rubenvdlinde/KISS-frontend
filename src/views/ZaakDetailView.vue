<template>
  <article>
    <simple-spinner v-if="zaak.loading" />

    <application-message
      v-if="zaak.error"
      messageType="error"
      message="Er kon geen zaak gevonden worden"
    ></application-message>

    <zaak-details
      :zaak="zaak.data"
      v-if="zaak.success"
      @zaak-updated="handleZaakUpdated"
    />
  </article>
</template>

<script setup lang="ts">
import { useZaakById } from "@/features/zaaksysteem/service";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ZaakDetails from "@/features/zaaksysteem/ZaakDetails.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { computed } from "vue";

const props = defineProps<{ zaakId: string }>();

const zaak = useZaakById(computed(() => props.zaakId));

const handleZaakUpdated = () => {
  zaak.refresh();
};
</script>

<style scoped lang="scss"></style>
