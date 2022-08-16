<template>
  <application-message
    v-if="gespresResultatenServiceResult.state === 'error'"
    messageType="error"
    :message="gespresResultatenServiceResult.error.message"
  ></application-message>

  <form
    v-if="
      contactmomentStore.contactmomentLoopt &&
      gespresResultatenServiceResult.state === 'success'
    "
    @submit.prevent="submit"
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

      <label for="gespreksresultaat" class="utrecht-form-label"
        >gespreksresultaat</label
      >
      <select
        id="gespreksresultaat"
        v-model="contactmoment.resultaat"
        class="utrecht-select utrecht-select--html-select"
        v-focus
        :disabled="isTerugbelNotitie"
      >
        <option
          v-for="gespreksresultaat in gespresResultatenServiceResult.data"
          :key="gespreksresultaat.id"
        >
          {{ gespreksresultaat.definitie }}
        </option>
      </select>

      <p v-if="contactmomentStore.contactverzoek">
        Contactverzoek verstuurd naar
        {{ contactmomentStore.contactverzoek.medewerker }}
      </p>
    </fieldset>

    <application-message
      class="formValidationMessage"
      v-if="validationMessage != ''"
      messageType="error"
      :message="validationMessage"
    ></application-message>

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

  <simple-spinner
    v-else-if="gespresResultatenServiceResult.state === 'loading'"
  ></simple-spinner>

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
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, computed } from "vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import {
  useContactmomentStore,
  type Contactmoment,
} from "@/stores/contactmoment";
import { useContactmomentService } from "./service";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { useConfirmDialog, whenever } from "@vueuse/core";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";
import { getFormattedUtcDate } from "@/services";

const router = useRouter();
const user = useUserStore();
const contactmomentStore = useContactmomentStore();
const service = useContactmomentService();

const cancelDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);
const contactmoment: Contactmoment = reactive({
  vorigContactmoment: undefined,
  voorkeurskanaal: "",
  voorkeurstaal: "",
  tekst: "",
  onderwerpLinks: [],
  initiatiefnemer: "klant", //enum "gemeente" of "klant"
  medewerker: "",
  medewerkerIdentificatie: undefined,
  resultaat: "",
  kanaal: "",
  bronorganisatie:
    Array.isArray(window.organisatieIds) && window.organisatieIds[0]
      ? window.organisatieIds[0]
      : "",
  registratiedatum: "",
});

const gespresResultatenServiceResult = service.getGespreksResultaten();
const validationMessage = ref("");

const emit = defineEmits(["save"]);

cancelDialog.onConfirm(() => annuleren());

// voorkeurs kanaal voorselecteren
// organisatieId instellen, nb een medewerker kan voor meerdere organisaties tegelijk werken. vooralsnog is er geen mogelijkheid om een organisatie te selecteren. we kiezen altijd de eerste
onMounted(() => (contactmoment.kanaal = user.preferences.kanaal));

//validate
//contactmoment opslaan
//user preferences bijwerken
const submit = () => {
  if (!contactmoment.resultaat) {
    validationMessage.value = "selecteer een gespreksresultaat";
    return;
  }

  validationMessage.value = "";
  contactmoment.registratiedatum = getFormattedUtcDate();
  user.setKanaal(contactmoment.kanaal);
  emit("save", contactmoment);
};

//stop het contactmoment en ga terug naar home
const annuleren = () => {
  contactmomentStore.stop();
  router.push({ name: "home" });
};

const isTerugbelNotitie = computed(() => !!contactmomentStore.contactverzoek);

whenever(
  isTerugbelNotitie,
  () => {
    contactmoment.resultaat = "Terugbelnotitie gemaakt";
  },
  { immediate: true }
);
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
  grid-gap: 2rem;
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

.formValidationMessage {
  margin-top: 2rem;
}
</style>
