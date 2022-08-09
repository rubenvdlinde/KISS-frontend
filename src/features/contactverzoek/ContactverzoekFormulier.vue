<template>
  <form @submit.prevent ref="form">
    <fieldset class="utrecht-form-fieldset">
      <p v-if="!medewerkers || medewerkers.length == 0">
        Zoek de medewerker voor wie het contactverzoek bestemd is via het
        algemene zoekveld
      </p>
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
          v-model="contactverzoek.todo.attendees"
          required
          :checked="medewerker.checked"
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
          :readonly="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        E-mailadres van de klant
        <input
          type="email"
          name="klant-email"
          v-model="contactverzoek.todo.email"
          class="utrecht-textbox utrecht-textbox--html-input"
          :readonly="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 1 van de klant
        <input
          type="tel"
          v-model="contactverzoek.todo.telefoonnummer1"
          class="utrecht-textbox utrecht-textbox--html-input"
          :readonly="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 2 van de klant
        <input
          type="tel"
          v-model="contactverzoek.todo.telefoonnummer2"
          class="utrecht-textbox utrecht-textbox--html-input"
          :readonly="klantReadonly"
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
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import type { Contactverzoek, MedewerkerOptie } from "./types";
import { toast } from "@/stores/toast";

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
    medewerkers.value = newVal.map(({ achternaam, emailadres }, i) => {
      return {
        email: achternaam,
        naam: emailadres,
        checked: i === newVal.length - 1,
      } as MedewerkerOptie;
    });
  },
  { immediate: true }
);

const klantReadonly = computed(() => !!contactmomentStore.klant);

watch(
  () => contactmomentStore.klant,
  (klant) => {
    contactverzoek.todo.naam = [
      klant?.voornaam,
      klant?.voorvoegselAchternaam,
      klant?.achternaam,
    ]
      .filter(Boolean)
      .join(" ");

    contactverzoek.todo.email = klant?.emailadres;
    contactverzoek.todo.telefoonnummer1 = klant?.telefoonnummer;
  }
);

const form = ref<HTMLFormElement>();

const validate = () => {
  if (!form.value) return false;
  if (!medewerkers.value.length) {
    toast({
      type: "error",
      text: "Zoek eerst een collega in de zoekbalk.",
    });
    const globalSearch = document.getElementById("global-search-input");
    if (globalSearch && globalSearch instanceof HTMLInputElement) {
      globalSearch.focus();
    }
    return false;
  }

  const emailInput = form.value.elements.namedItem("klant-email");

  if (emailInput instanceof HTMLInputElement) {
    emailInput.setCustomValidity(emailRequiredMessage.value);
  }

  if (!form.value.reportValidity()) {
    toast({
      type: "error",
      text: "Vul eerst het contactverzoek correct en volledig in.",
    });
    return false;
  }

  return true;
};

const emailIsRequired = computed(
  () =>
    !klantReadonly.value &&
    !contactverzoek.todo.telefoonnummer1 &&
    !contactverzoek.todo.telefoonnummer2
);

const emailRequiredMessage = computed(() =>
  emailIsRequired.value && !contactverzoek.todo.email
    ? "Vul een minimaal een e-mailadres of een telefoonnummer van de klant in"
    : ""
);

defineExpose({ validate });
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

fieldset fieldset {
  gap: var(--spacing-small);
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
