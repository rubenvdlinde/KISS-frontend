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
    <nav>
      <utrecht-button
        type="button"
        @click="cancelDialog.reveal"
        appearance="secondary-action-button"
        >Annuleren</utrecht-button
      >
      <utrecht-button type="submit">Opslaan</utrecht-button>
    </nav>
  </form>

  <simple-spinner v-else-if="saving"></simple-spinner>

  <application-message
    v-else-if="saved"
    messageType="confirm"
    message="Het contactmoment is opgeslagen."
  ></application-message>

  <!-- Annuleer Dialog -->

  <div v-if="cancelDialogRevealed" class="modal-layout">
    <div class="modal">
      <div>
        <paragraph>
          Weet u zeker dat u het contactmoment wilt annuleren? Alle gegevens
          worden verwijderd.
        </paragraph>
      </div>
      <nav>
        <utrecht-button
          @click="cancelDialog.cancel"
          appearance="secondary-action-button"
          >Nee</utrecht-button
        >
        <utrecht-button @click="cancelDialog.confirm">Ja</utrecht-button>
      </nav>
    </div>
  </div>

  <!-- Submit Dialog -->

  <div v-if="submitDialogRevealed" class="modal-layout">
    <div class="modal">
      <div>
        <p>Weet u zeker dat u het contactmoment wilt opslaan?</p>
      </div>
      <nav>
        <utrecht-button
          @click="submitDialog.cancel"
          appearance="secondary-action-button"
          >Nee</utrecht-button
        >
        <utrecht-button @click="submitDialog.confirm">Ja</utrecht-button>
      </nav>
    </div>
  </div>
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
});

cancelDialog.onConfirm(() => annuleren());

submitDialog.onConfirm(() => submit());

// voorkeurs kanaal voorselecteren
// organisatieId instellen, nb een medewerker kan voor meerdere organisaties tegelijk werken. vooralsnog is er geen mogelijkheid om een organisatie te selecteren. we kiezen altijd de eerste
onMounted(() => {
  contactmoment.bronorganisatie =
    Array.isArray(window.organisatieIds) && window.organisatieIds[0]
      ? window.organisatieIds[0]
      : "";
  contactmoment.kanaal = user.preferences.kanaal;
});

//contactmoment opslaan
//user preferences bijwerken
//contactmoment stoppen
//terug naar home
//confirmation tonen
const submit = () => {
  saveFailed.value = false;
  saving.value = true;
  saved.value = false;

  // todo na fix validatie issues op de api
  contactmoment.registratiedatum = getFormattedDate();
  contactmoment.registratiedatum = "2005-12-30UTC01:02:03"; //zo zou het volgens de validatie melding moeten
  contactmoment.registratiedatum = "2022-04-06 13:53:00"; //maar alleen dit wordt geaccepteerd

  service
    .save(contactmoment)
    .then((x) => {
      user.setKanaal(contactmoment.kanaal);

      if (x) {
        saved.value = true;
        contactmomentStore.stop();
      } else {
        saveFailed.value = true;
      }
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

//date format helper
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

nav {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* modals */
.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border: 1px solid var(--color-primary);
  z-index: 10;
  border-radius: var(--radius-default);
}
.modal-layout {
  z-index: 20;
  left: 0;
  top: 0;
  position: fixed;
  background-color: #666666cc;
  width: 100%;
  height: 100%;
}
</style>
