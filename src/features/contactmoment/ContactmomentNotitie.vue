<template>
  <utrecht-heading model-value :level="2">Notitieblok</utrecht-heading>
  <textarea
    ref="notitieRef"
    @change="notitieChanged"
    v-model="contactmomentStore.notitie"
    v-focus
    v-bind="$attrs"
    placeholder="Voeg hier je notities toe"
  >
  </textarea>
</template>

<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
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

<style lang="scss">
textarea {
  flex: 1;
}
</style>
