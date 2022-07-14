<template>
  <simple-spinner v-if="serviceResult?.loading"></simple-spinner>

  <form v-else @submit.prevent="submit">
    <fieldset class="utrecht-form-fieldset">
      <label for="content" class="utrecht-form-label"
        >Citeer de tekst waar het om gaat</label
      >
      <textarea
        id="content"
        v-model="feedback.content"
        class="utrecht-textarea utrecht-textarea--html-textarea"
      ></textarea>

      <label for="opmerking" class="utrecht-form-label"
        >Omschrijf wat je feedback is<span class="required">*</span></label
      >
      <textarea
        id="opmerking"
        v-model="feedback.opmerking"
        class="utrecht-textarea utrecht-textarea--html-textarea"
      ></textarea>

      <label for="aanleiding" class="utrecht-form-label"
        >Wat is de aanleiding?</label
      >
      <textarea
        id="aanleiding"
        v-model="feedback.aanleiding"
        class="utrecht-textarea utrecht-textarea--html-textarea"
      ></textarea>

      <label for="contactgegevens" class="utrecht-form-label"
        >Het emailadres of telefoonnummer waarop de auteur jou kan
        bereiken</label
      >
      <input
        type="text"
        id="contactgegevens"
        v-model="feedback.contactgegevens"
        class="utrecht-textbox utrecht-textbox--html-input"
      />
    </fieldset>

    <application-message
      class="formValidationMessage"
      v-if="validationMessage != ''"
      messageType="error"
      :message="validationMessage"
    ></application-message>

    <application-message
      v-if="serviceResult?.error"
      messageType="error"
      message="Er is een fout opgetreden"
    ></application-message>

    <menu>
      <button
        @click="cancelDialog.reveal"
        class="utrecht-button utrecht-button--secondary-action"
        type="button"
      >
        Annuleren
      </button>

      <button class="utrecht-button utrecht-button--submit" type="submit">
        Opslaan
      </button>
    </menu>
  </form>

  <!-- Annuleer Dialog -->
  <modal-template v-if="cancelDialogRevealed">
    <template #message>
      <paragraph>
        Weet u zeker dat u wilt annuleren? Alle gegevens worden verwijderd.
      </paragraph>
    </template>

    <template #menu>
      <button
        @click="cancelDialog.cancel"
        class="utrecht-button utrecht-button--secondary-action"
      >
        Nee
      </button>
      <button @click="cancelDialog.confirm" class="utrecht-button">Ja</button>
    </template>
  </modal-template>
</template>

<script lang="ts" setup>
import { ref, reactive, defineProps } from "vue";
import { useFeedbackService } from "../service";
import type { Feedback } from "../types";
import { useConfirmDialog } from "@vueuse/core";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import type { ServiceData } from "@/services/index";

const props = defineProps<{
  id: unknown | URL;
  name: string;
}>();

const serviceResult = ref<ServiceData<Feedback>>();
const service = useFeedbackService();
const cancelDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);
const emit = defineEmits(["cancelled", "saved"]);
const feedback: Feedback = reactive({
  naam: props.name,
  uri: props.id,
  content: "",
  opmerking: "",
  aanleiding: "",
  contactgegevens: "",
});

const validationMessage = ref("");

cancelDialog.onConfirm(() => annuleren());

//validate
//opslaan
const submit = () => {
  validationMessage.value = feedback.opmerking
    ? ""
    : "het veld 'Omschrijf wat je feedback is' is verplicht";

  if (validationMessage.value) {
    return;
  }

  const result = service.postFeedback(feedback);
  serviceResult.value = result.state;

  result.promise.then(() => {
    clear();
    emit("saved");
  });
};

//maak leeg en verberg het formulier
const annuleren = () => {
  clear();
  emit("cancelled");
};

const clear = () => {
  feedback.content = "";
  feedback.opmerking = "";
  feedback.aanleiding = "";
  feedback.contactgegevens = "";
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

fieldset {
  display: grid;
  align-items: center;
  grid-gap: 1rem;
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

.error,
.confirm {
  margin-top: var(--spacing-default);
}
</style>
