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

const contactmoment: Contactmoment = reactive({
  vorigContactmoment: null,
  bronorganisatie: "999990639", //environment var? kunnen er eventueel meerdere zijn bij een shared contactcenter, moet het beheerd kunnen worden of onderdeel van de installatie?
  //registratiedatum: op moment van opslaan
  //kanaal: string; wordt in het formulier gekozen
  voorkeurskanaal: "",
  voorkeurstaal: "",
  tekst: "",
  onderwerpLinks: [],
  initiatiefnemer: "klant", //enum "gemeente" of "klant"
  medewerker: "",
  medewerkerIdentificatie: null,
});

const onAnnuleren = () => contactmomentStore.cancel();

const getFormattedDate = () => {
  const formatDateTimeElement = (x) => ("0" + x).slice(-2);

  var now = new Date(); //2005-12-30UTC01:02:03

  return `${now.getFullYear()}-${formatDateTimeElement(
    now.getMonth() + 1
  )}-${now.getDate()}UTC${formatDateTimeElement(
    now.getHours()
  )}:${formatDateTimeElement(now.getMinutes())}:${formatDateTimeElement(
    now.getSeconds()
  )}`;
};

const onOpslaan = () => {
  contactmoment.registratiedatum = getFormattedDate();
  contactmoment.registratiedatum = "2005-12-30UTC01:02:03"; //zo zou het volgens de validatie melding moeten
  contactmoment.registratiedatum = "2022-04-06 13:53:00"; //maar alleen dit wordt geaccepteerd

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
