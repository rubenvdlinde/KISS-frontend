<template>
  <utrecht-heading model-value :level="2">Notitieblok</utrecht-heading>
  <textarea
    ref="notitieRef"
    @change="notitieChanged"
    v-model="contactmomentStore.notitie"
    v-focus
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

<style lang="scss">
textarea {
  border: none;
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
