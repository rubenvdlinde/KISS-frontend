<template>
  <nav>
    <utrecht-button
      v-if="contactmoment.contactmomentLoopt"
      type="button"
      class="contactmomentLoopt"
      @click="onStopContactMoment"
      >Einde contactmoment</utrecht-button
    >
    <utrecht-button v-else type="button" @click="onStartContactMoment"
      >Start contactmoment</utrecht-button
    >
  </nav>
</template>

<script setup lang="ts">
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmoment = useContactmomentStore();

const onStartContactMoment = () => contactmoment.start();

const onStopContactMoment = () => contactmoment.stop();
</script>

<style scoped lang="scss">
nav {
  position: fixed;
  bottom: var(--utrecht-space-row-4xl);
  right: var(--utrecht-space-column-2xl);
}

utrecht-button {
  --utrecht-button-border-radius: 100px;
}


utrecht-button.contactmomentLoopt {
  --utrecht-button-border-radius: 100px;
  --utrecht-button-background-color: var(--color-accent);
}
</style>
