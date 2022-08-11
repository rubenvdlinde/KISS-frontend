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
        v-for="{ id, emailadres, naam, checked } in medewerkers"
        :key="id"
        class="radio"
      >
        <input
          type="radio"
          name="medewerker"
          :value="emailadres"
          v-model="contactverzoek.todo.attendees"
          required
          :checked="checked"
        />
        {{ naam }}
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

    <label class="utrecht-form-label notitie">
      <span class="required">Notitie bij het contactverzoek</span>
      <textarea
        v-model="contactmomentStore.notitie"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        required
      />
    </label>
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import {
  useContactmomentStore,
  type Contactverzoek,
} from "@/stores/contactmoment";
import { toast } from "@/stores/toast";

type MedewerkerOptie = {
  id: string;
  emailadres: string;
  naam: string;
  checked: boolean;
};

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
const klantReadonly = computed(() => !!contactmomentStore.klant);
const form = ref<HTMLFormElement>();

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

watch(
  contactmomentStore.medewerkers,
  (newVal) => {
    medewerkers.value = newVal.map(
      ({ achternaam, voornaam, voorvoegselAchternaam, emailadres, id }, i) => {
        return {
          id,
          emailadres,
          naam: [voornaam, voorvoegselAchternaam, achternaam]
            .filter(Boolean)
            .join(" "),
          checked: i === newVal.length - 1,
        };
      }
    );
  },
  { immediate: true }
);

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
    contactverzoek.todo.telefoonnummer2 = undefined;
  },
  { immediate: true }
);

watch(
  () => contactmomentStore.notitie,
  (n) => {
    contactverzoek.todo.description = n;
  },
  { immediate: true }
);

function validate() {
  if (!form.value) return false;
  if (!medewerkers.value.length) {
    toast({
      type: "error",
      text: "Zoek eerst een collega in de zoekbalk, of wissel naar een reguliere notitie.",
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
      text: "Vul eerst het contactverzoek correct en volledig in, of wissel naar een reguliere notie.",
    });
    return false;
  }

  return true;
}

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

form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

form,
fieldset {
  gap: var(--spacing-default);
}

fieldset {
  display: grid;
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

.notitie,
textarea {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.notitie textarea.utrecht-textarea {
  padding: var(--spacing-small);
}
</style>
