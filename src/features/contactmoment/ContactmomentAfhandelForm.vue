<template>
  <application-message
    v-if="saveFailed && !saving"
    messageType="error"
    message="Er is een probleem opgetreden. Het contactmoment is niet opgeslagen."
  ></application-message>

  <form
    v-if="contactmomentStore.contactmomentLoopt && !saving"
    @submit.prevent="submitDialog.reveal"
  >
    <fieldset class="utrecht-form-fieldset">
      <legend
        class="utrecht-form-fieldset__legend utrecht-form-fieldset__legend--distanced"
      >
        Details
      </legend>

      <label for="kanaal" class="utrecht-form-label">kanaal</label>
      <select
        id="kanaal"
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
        <option>WhatsApp</option>
      </select>
    </fieldset>
    <menu>
      <utrecht-button
        modelValue
        type="button"
        @click="cancelDialog.reveal"
        appearance="secondary-action-button"
        >Annuleren</utrecht-button
      >
      <utrecht-button modelValue type="submit">Opslaan</utrecht-button>
    </menu>
  </form>

  <simple-spinner v-else-if="saving"></simple-spinner>

  <application-message
    v-else-if="saved"
    messageType="confirm"
    message="Het contactmoment is opgeslagen."
  ></application-message>

  <!-- Annuleer Dialog -->

  <modal-template v-if="cancelDialogRevealed">
    <template #message>
      <paragraph>
        Weet u zeker dat u het contactmoment wilt annuleren? Alle gegevens
        worden verwijderd.
      </paragraph>
    </template>

    <template #menu>
      <utrecht-button
        modelValue
        @click="cancelDialog.cancel"
        appearance="secondary-action-button"
        >Nee</utrecht-button
      >
      <utrecht-button modelValue @click="cancelDialog.confirm"
        >Ja</utrecht-button
      >
    </template>
  </modal-template>

  <!-- Submit Dialog -->

  <modal-template v-if="submitDialogRevealed">
    <template #message>
      <p>Weet u zeker dat u het contactmoment wilt opslaan?</p>
    </template>
    <template #menu>
      <utrecht-button
        modelValue
        @click="submitDialog.cancel"
        appearance="secondary-action-button"
        >Nee</utrecht-button
      >
      <utrecht-button modelValue @click="submitDialog.confirm"
        >Ja</utrecht-button
      >
    </template>
    >
  </modal-template>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { useContactmomentService } from "@/features/contactmoment";
import type { Contactmoment } from "./types";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useConfirmDialog } from "@vueuse/core";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";

const router = useRouter();
const user = useUserStore();
const contactmomentStore = useContactmomentStore();
const service = useContactmomentService();
const saved = ref(false);
const saving = ref(false);
const saveFailed = ref(false);
const cancelDialogRevealed = ref(false);
const submitDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);
const submitDialog = useConfirmDialog(submitDialogRevealed);
const contactmoment: Contactmoment = reactive({
  vorigContactmoment: null,
  voorkeurskanaal: "",
  voorkeurstaal: "",
  tekst: "",
  onderwerpLinks: [],
  initiatiefnemer: "klant", //enum "gemeente" of "klant"
  medewerker: "",
  medewerkerIdentificatie: null,
  kanaal: "",
  bronorganisatie:
    Array.isArray(window.organisatieIds) && window.organisatieIds[0]
      ? window.organisatieIds[0]
      : "",
  registratiedatum: "",
});

cancelDialog.onConfirm(() => annuleren());

submitDialog.onConfirm(() => submit());

// voorkeurs kanaal voorselecteren
// organisatieId instellen, nb een medewerker kan voor meerdere organisaties tegelijk werken. vooralsnog is er geen mogelijkheid om een organisatie te selecteren. we kiezen altijd de eerste
onMounted(() => {
  contactmoment.kanaal = user.preferences.kanaal;
});

//contactmoment opslaan
//user preferences bijwerken
//contactmoment stoppen
//confirmation tonen
const submit = () => {
  saveFailed.value = false;
  saving.value = true;
  saved.value = false;

  contactmoment.registratiedatum = getFormattedUtcDate();

  service
    .save(contactmoment)
    .then(() => {
      user.setKanaal(contactmoment.kanaal);

      saved.value = true;
      contactmomentStore.stop();
    })
    .catch(() => {
      saveFailed.value = true;
    })
    .finally(() => {
      saving.value = false;
    });
};

//stop het contactmoment en ga terug naar home
const annuleren = () => {
  contactmomentStore.stop();
  router.push({ name: "home" });
};

//date format helper: 2005-12-30UTC01:02:03
const getFormattedUtcDate = () => {
  const formatDateTimeElement = (x: number) => ("0" + x).slice(-2);

  var now = new Date();

  return `${now.getFullYear()}-${formatDateTimeElement(
    now.getMonth() + 1
  )}-${formatDateTimeElement(now.getDate())}UTC${formatDateTimeElement(
    now.getUTCHours()
  )}:${formatDateTimeElement(now.getUTCMinutes())}:${formatDateTimeElement(
    now.getSeconds()
  )}`;
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

/* default nl-design styling overruled, zodat er geen custom icon toegevoegd hoeft te worden (onnodig en onduidelijk of het anders wel op alle os-en werkt)  */
.utrecht-select {
  appearance: auto;
  -webkit-appearance: auto;
}

fieldset {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr 2fr;
}

label {
  grid-column: 1 / 2;
}

menu {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
