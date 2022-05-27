<template>
  <form>
    <label>kanaal</label>
    <select
      v-model="contactmoment.kanaal"
      class="utrecht-select utrecht-select--html-select"
    >
      <option>telefoon</option>
      <option>e-mail</option>
      <option>contactformulier</option>
      <option>Twitter</option>
      <option>Facebook</option>
      <option>LinkedIn</option>
      <option>live chat</option>
      <option>Instagram</option>
      <option>WhatsApp.</option>
    </select>
    <utrecht-button type="button" @click="onAnnuleren"
      >Annuleren</utrecht-button
    >
    <utrecht-button v type="button" @click="onOpslaan">Opslaan</utrecht-button>
  </form>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { useContactmomentService } from "@/features/contactmoment";
import type { Contactmoment } from "./types";

const contactmomentStore = useContactmomentStore();
const service = useContactmomentService();

const contactmoment: Contactmoment = reactive({});

const onAnnuleren = () => contactmomentStore.cancel();

const onOpslaan = () => {
  service.save(contactmoment);
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

/* default nl-design styling overruled, zodat er geen custom icon toegevoegd hoeft te worden (onnodig en onduidelijk of het anders wel op alle os-en werkt)  */
.utrecht-select {
  appearance: auto;
  -webkit-appearance: auto;
}
</style>
