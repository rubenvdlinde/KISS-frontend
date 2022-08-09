<template>
  <form @submit.prevent="submit">
    <fieldset>
      <legend v-if="!medewerkers || medewerkers.length == 0">
        Zoek de medewerker voor wie het contactverzoek bestemd is via het
        algemene zoekveld
      </legend>
      <legend v-else class="utrecht-form-label">
        <span class="required">Contactverzoek versturen naar</span>
      </legend>

      <label
        v-for="medewerker in medewerkers"
        :key="medewerker.email"
        class="radio"
      >
        <input
          type="radio"
          name="medewerker"
          :value="medewerker.email"
          required
        />
        {{ medewerker.naam.naam }}
      </label>
    </fieldset>
    <fieldset class="utrecht-form-fieldset">
      <label class="utrecht-form-label">
        <span class="required">Naam van de klant</span>
        <input
          type="text"
          v-model="contactverzoek.todo.naam"
          class="utrecht-textbox utrecht-textbox--html-input"
          required
        />
      </label>

      <label class="utrecht-form-label">
        E-mailadres van de klant
        <input
          type="text"
          v-model="contactverzoek.todo.email"
          class="utrecht-textbox utrecht-textbox--html-input"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 1 van de klant
        <input
          type="text"
          v-model="contactverzoek.todo.telefoonnummer1"
          class="utrecht-textbox utrecht-textbox--html-input"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 2 van de klant
        <input
          type="text"
          v-model="contactverzoek.todo.telefoonnummer2"
          class="utrecht-textbox utrecht-textbox--html-input"
        />
      </label>
    </fieldset>

    <label class="utrecht-form-label">
      <span class="required">Notitie bij het contactverzoek</span>
      <textarea
        v-model="contactverzoek.todo.description"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        required
      />
    </label>

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
          Versturen
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
import { ref, reactive, defineProps, watch } from "vue";
import { useConfirmDialog } from "@vueuse/core";
import { useContactmomentStore } from "@/stores/contactmoment/index.js";
import type { Contactverzoek, MedewerkerOptie } from "./types.js";
import { usePostContactverzoek } from "./service.js";
import type { ServiceData } from "@/services/index.js";
import type { Medewerker } from "@/stores/contactmoment/types";

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
const medewerkers = ref<MedewerkerOptie[]>([]);

watch(
  contactmomentStore.medewerkers,
  (newVal) => {
    medewerkers.value = newVal.map(({ achternaam, emailadres }) => {
      return { email: achternaam, naam: emailadres } as MedewerkerOptie;
    });
  },
  { immediate: true }
);

// cancel

const cancelDialogRevealed = ref(false);
const cancelDialog = useConfirmDialog(cancelDialogRevealed);
cancelDialog.onConfirm(() => {
  clear();
  emit("cancelled");
});

//submit

const serviceResult = ref<ServiceData<void>>();

const submit = () => {
  const isValid = validate();
  if (!isValid) {
    return;
  }

  const result = usePostContactverzoek(contactverzoek);
  serviceResult.value = result;

  result.then(() => {
    clear();
    emit("saved");
  });
};

//leegmaken heeft geen zin
//terug zettten naar de initiele waarde

const clear = () => {
  contactverzoek.todo.naam = props.naam ?? "";
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

form,
fieldset {
  display: grid;
  gap: var(--spacing-default);
}

label {
  display: grid;
  gap: var(--spacing-small);
}

label.radio {
  grid-template-columns: min-content 1fr;
  align-items: center;

  input {
    margin: 0;
  }
}

legend {
  margin-block-end: var(--spacing-small);
}
</style>
