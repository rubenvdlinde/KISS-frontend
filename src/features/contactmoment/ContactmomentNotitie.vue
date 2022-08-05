<template>
  <utrecht-heading model-value :level="2">Notitieblok</utrecht-heading>
  <textarea
    ref="notitieRef"
    @change="notitieChanged"
    v-model="contactmomentStore.notitie"
    v-focus
    v-bind="$attrs"
    placeholder="Voeg hier je notites toe"
  >
  </textarea>
</template>

<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmomentStore = useContactmomentStore();

const notitieChanged = (element: any) => {
  contactmomentStore.setNotitie(element.target.value);
};
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<style lang="scss"></style>
