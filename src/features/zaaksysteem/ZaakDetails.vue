<template>
  <!--hier komen de zaak details... -->
  <div></div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./types";

defineProps<{
  zaak: ZaakDetails;
}>();
</script>

<style scoped lang="scss"></style>
