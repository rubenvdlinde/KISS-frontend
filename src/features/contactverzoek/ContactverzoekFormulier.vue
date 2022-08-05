<template>
  <form @submit.prevent="submit">
    <fieldset class="utrecht-form-fieldset">
      <fieldset>
        <legend v-if="!medewerkers || medewerkers.length == 0">
          Zoek de medewerker voor wie het contactverzoek bestemd is via het
          algemene zoekveld
        </legend>

        <div v-for="medewerker in medewerkers" :key="medewerker.value">
          <input
            type="radio"
            :id="medewerker.value"
            name="medewerker"
            :value="medewerker.value"
          />
          <label :for="medewerker.value">{{ medewerker.label }}</label>
        </div>
      </fieldset>

      <label for="naam" class="utrecht-form-label"
        >Naam<span class="required">*</span></label
      >
      <input
        type="text"
        id="naam"
        v-model="contactverzoek.todo.naam"
        class="utrecht-textbox utrecht-textbox--html-input"
        required
      />

      <label for="email" class="utrecht-form-label">E-mailadres</label>
      <input
        type="text"
        id="email"
        v-model="contactverzoek.todo.email"
        class="utrecht-textbox utrecht-textbox--html-input"
      />

      <label for="telefoonnummer1" class="utrecht-form-label"
        >Telefoonnummer 1</label
      >
      <input
        type="text"
        id="telefoonnummer1"
        v-model="contactverzoek.todo.telefoonnummer1"
        class="utrecht-textbox utrecht-textbox--html-input"
      />

      <label for="telefoonnummer2" class="utrecht-form-label"
        >Telefoonnummer 2</label
      >
      <input
        type="text"
        id="telefoonnummer2"
        v-model="contactverzoek.todo.telefoonnummer2"
        class="utrecht-textbox utrecht-textbox--html-input"
      />

      <label for="notitie" class="utrecht-form-label"
        >Notitie<span class="required">*</span></label
      >
      <textarea
        id="notitie"
        v-model="contactverzoek.todo.description"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        required
      ></textarea>
    </fieldset>

    <application-message
      v-if="validationmessage"
      messageType="error"
      :message="validationmessage"
    ></application-message>

    <application-message
      v-if="serviceResult?.error"
      messageType="error"
      message="Er is een fout opgetreden"
    ></application-message>

    <menu>
      <li>
        <button
          @click="cancelDialog.reveal"
          class="utrecht-button utrecht-button--secondary-action"
          type="button"
        >
          Annuleren
        </button>
      </li>
      <li>
        <button class="utrecht-button utrecht-button--submit" type="submit">
          Toevoegen aan het contactmoment
        </button>
      </li>
    </menu>
  </form>

  <!-- Annuleer Dialog -->
  <modal-template v-if="cancelDialogRevealed">
    <template #message>
      <paragraph>
        Weet u zeker dat je het contactverzoek wilt annuleren? Alle gegevens
        worden verwijderd.
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
import { useConfirmDialog } from "@vueuse/core";
import { useContactmomentStore } from "@/stores/contactmoment/index.js";
import type { Contactverzoek } from "./types.js";
import { useContactverzoekService } from "./service.js";
import type { ServiceData } from "@/services/index.js";
// import SimpleSpinner from "@/components/SimpleSpinner.vue";
// import ApplicationMessage from "@/components/ApplicationMessage.vue";
// import ModalTemplate from "@/components/ModalTemplate.vue";
// import Paragraph from "@/nl-design-system/components/Paragraph.vue";
// import type { ServiceData } from "@/services/index";
// import { useContactmomentStore } from "@/stores/contactmoment";

const emit = defineEmits(["cancelled", "saved"]);

//initieel worden de gegevens van de klant, indien beschikbaar, overgenomen
const props = defineProps<{
  naam: string;
  email: string;
  telefoonnummer1: string;
  telefoonnummer2: string;
}>();

const contactverzoek = reactive<Contactverzoek>({
  bronorganisatie: window.activeOrganisatieId,
  todo: {
    naam: props.naam,
    email: props.email,
    telefoonnummer1: props.telefoonnummer1,
    telefoonnummer2: props.telefoonnummer2,
    description: "",
    attendees: "",
  },
});

//available medewerkers

const contactmomentStore = useContactmomentStore();
const medewerkers = contactmomentStore.medewerkers
  ? contactmomentStore.medewerkers.map(({ achternaam, email }) => {
      return { label: achternaam, value: email };
    })
  : [];

// cancel

const cancelDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);
cancelDialog.onConfirm(() => {
  clear();
  emit("cancelled");
});

//submit

const serviceResult = ref<ServiceData<Contactverzoek>>();
const service = useContactverzoekService();

const submit = () => {
  const isValid = validate();
  if (!isValid) {
    return;
  }

  const result = service.post(contactverzoek);
  serviceResult.value = result.state;

  result.promise.then(() => {
    clear();
    emit("saved");
  });
};

//leegmaken heeft geen zin
//terug zettten naar de initiele waarde

const clear = () => {
  contactverzoek.todo.naam = props.naam;
  contactverzoek.todo.email = props.email;
  contactverzoek.todo.telefoonnummer1 = props.telefoonnummer1;
  contactverzoek.todo.telefoonnummer2 = props.telefoonnummer2;
  contactverzoek.todo.description = "";
  contactverzoek.todo.attendees = "";
};

//validate

const validationmessage = ref("");

const validate = () => {
  validationmessage.value = "";
  if (!contactverzoek.todo.attendees) {
    validationmessage.value =
      "Er is geen medewerker geselecteerd. Zoek een medewerker via de algemeen zoekfunctie";
    return false;
  }

  if (
    !contactverzoek.todo.email &&
    !contactverzoek.todo.telefoonnummer1 &&
    !contactverzoek.todo.telefoonnummer2
  ) {
    validationmessage.value =
      "Minimaal één emailadres of telefoonnummer is verplicht.";
    return false;
  }

  return true;
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

.error,
.confirm {
  margin-top: var(--spacing-default);
}
</style>
