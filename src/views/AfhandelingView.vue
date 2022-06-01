<template>
  <utrecht-heading :level="1">Afhandeling</utrecht-heading>
  <contactmoment-afhandel-form class="layoutcontainer-small" />
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ContactmomentAfhandelForm } from "@/features/contactmoment";
</script>

<style scoped lang="scss">
.layoutcontainer-small {
  max-width: 40rem;
}
</style>
