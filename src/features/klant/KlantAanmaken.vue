<template>
  <utrecht-heading :level="2" modelValue>Nieuwe klant</utrecht-heading>

  <simple-spinner v-if="savingKlant" />

  <form v-else @submit.prevent="submit">
    <div class="input-group">
      <label for="voornaam" class="utrecht-form-label">Voornaam</label>
      <input
        id="voornaam"
        type="text"
        class="utrecht-textbox utrecht-textbox--html-input"
        v-model="formData.voornaam"
        required
      />
    </div>

    <div class="input-group">
      <label for="tussenvoegsel" class="utrecht-form-label"
        >Tussenvoegsel</label
      >
      <input
        id="tussenvoegsel"
        type="text"
        class="utrecht-textbox utrecht-textbox--html-input"
        v-model="formData.tussenvoegsel"
      />
    </div>

    <div class="input-group">
      <label for="achternaam" class="utrecht-form-label">Achternaam</label>
      <input
        id="achternaam"
        type="text"
        class="utrecht-textbox utrecht-textbox--html-input"
        required
        v-model="formData.achternaam"
      />
    </div>

    <div class="input-group">
      <label for="email" class="utrecht-form-label">E-mailadres</label>
      <input
        id="email"
        type="email"
        class="utrecht-textbox utrecht-textbox--html-input"
        required
        v-model="formData.email"
      />
    </div>

    <div class="input-group-with-warning">
      <div class="input-group">
        <label for="telefoonnummer" class="utrecht-form-label"
          >Telefoonnummer</label
        >
        <input
          v-model="formData.telefoonnummer"
          id="telefoonnummer"
          type="text"
          class="utrecht-textbox utrecht-textbox--html-input"
          required
        />
      </div>

      <div class="warning-container" v-if="telefoonnummerWarning[0]">
        <span class="warning">{{ telefoonnummerWarning[0] }}</span>
      </div>
    </div>

    <menu>
      <utrecht-button
        modelValue
        @click="props.handleCancel"
        type="button"
        appearance="secondary-action-button"
        >Annuleren</utrecht-button
      >
      <button class="utrecht-button utrecht-button--submit" type="submit">
        Opslaan
      </button>
    </menu>
  </form>
</template>

<script setup lang="ts">
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import { customPhoneValidator } from "@/helpers/validation";
import { ref, computed } from "vue";
import { createKlant } from "../contactverzoek";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { useContactmomentStore } from "@/stores/contactmoment";

const props = defineProps<{
  handleCancel: () => void;
  handleSaveCallback: () => void;
}>();

const formData = ref({
  voornaam: "",
  tussenvoegsel: "",
  achternaam: "",
  email: "",
  telefoonnummer: "",
});

const contactmomentStore = useContactmomentStore();

const savingKlant = ref(false);

const telefoonnummerWarning = computed(() => {
  return customPhoneValidator(formData.value.telefoonnummer);
});

const submit = async () => {
  savingKlant.value = true;
  await createKlant({
    voornaam: formData.value.voornaam,
    voorvoegselAchternaam: formData.value.tussenvoegsel,
    achternaam: formData.value.achternaam,
    telefoonnummers: [{ telefoonnummer: formData.value.telefoonnummer }],
    emails: [{ email: formData.value.email }],
  }).then((res) => {
    contactmomentStore.setKlant(res);
    savingKlant.value = false;
    props.handleSaveCallback();
  });
};
</script>

<style scoped lang="scss">
form {
  max-width: 600px;

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
}
.input-group {
  display: flex;
  align-items: center;

  label {
    width: 150px;
  }

  input {
    flex: 1;
    max-width: 450px;
  }
}
.warning-container {
  display: flex;
  justify-content: flex-end;
}
.warning {
  max-width: 450px;
  color: var(--color-error);
}

label {
  user-select: none;
}

menu {
  display: flex;
  gap: var(--spacing-default);
  justify-content: flex-end;
}
</style>
