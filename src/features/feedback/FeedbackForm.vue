<template>
  <simple-spinner v-if="busy"></simple-spinner>

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
        >Omschrijf wat je feedback is</label
      >
      <textarea
        id="content"
        v-model="feedback.opmerking"
        class="utrecht-textarea utrecht-textarea--html-textarea"
      ></textarea>

      <label for="aanleiding" class="utrecht-form-label"
        >Wat is de aanleiding?</label
      >
      <textarea
        id="content"
        v-model="feedback.aanleiding"
        class="utrecht-textarea utrecht-textarea--html-textarea"
      ></textarea>

      <label for="email" class="utrecht-form-label">jouw emailadres</label>
      <input
        type="email"
        id="content"
        v-model="feedback.email"
        class="utrecht-textbox utrecht-textbox--html-input"
      />
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

  <!-- Annuleer Dialog -->
  <modal-template v-if="cancelDialogRevealed">
    <template #message>
      <paragraph>
        Weet u zeker dat u wilt annuleren? Alle gegevens worden verwijderd.
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
import { ref, reactive, onMounted } from "vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useFeedbackService } from "./service";
import type { Feedback } from "./types";
import { useUserStore } from "@/stores/user";
import { useConfirmDialog } from "@vueuse/core";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";

const props = defineProps({
  close: {
    type: Function,
    required: false,
  },
});

const busy = ref(false);
const user = useUserStore();
const service = useFeedbackService();
const cancelDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);

const feedback: Feedback = reactive({
  naam: "",
  content: "",
  opmerking: "",
  aanleiding: "",
  email: "",
});

const validationMessage = ref("");

cancelDialog.onConfirm(() => annuleren());

// zodra we kunnen inloggen kunnen we het emailadres van de ingelogde gebruiker populaten.
onMounted(() => {
  console.log(user);
  //feedback.email = user.email
});

//validate
//opslaan
const submit = () => {
  //todo validate
  service.postFeedback(feedback);
  //form leegmaken
  //loading state en feedback..
};

//maak leeg en verberg het formulier
const annuleren = () => {
  feedback.naam = "";
  feedback.content = "";
  feedback.opmerking = "";
  feedback.aanleiding = "";
  feedback.email = "";

  console.log(props.close);
  if (props && props.close) {
    props.close();
  }
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

// fieldset {
//   display: grid;
//   align-items: center;
//   grid-gap: 2rem;
//   grid-template-columns: 1fr 2fr;
// }

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
