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
        v-for="{ id, emailadres, naam } in medewerkers"
        :key="id"
        class="radio"
      >
        <input
          type="radio"
          name="medewerker"
          :value="emailadres"
          v-model="contactverzoek.todo.attendees"
          required
        />
        {{ naam }}
      </label>
    </fieldset>
    <fieldset class="utrecht-form-fieldset">
      <label class="utrecht-form-label">
        <span class="required">Voornaam van de klant</span>
        <input
          type="text"
          v-model="nieuweKlant.voornaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          required
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        <span>Tussenvoegsel van de klant</span>
        <input
          type="text"
          v-model="nieuweKlant.voorvoegselAchternaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        <span class="required">Achternaam van de klant</span>
        <input
          type="text"
          v-model="nieuweKlant.achternaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          required
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        E-mailadres van de klant
        <input
          type="email"
          name="klant-email"
          v-model="nieuweKlant.emailadres"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer van de klant
        <input
          type="tel"
          v-model="nieuweKlant.telefoonnummer"
          class="utrecht-textbox utrecht-textbox--html-input"
          pattern="(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)"
          title="Vul een valide Nederlands telefoonnummer in"
          :disabled="klantReadonly"
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
  type NieuweKlant,
} from "@/stores/contactmoment";
import { toast } from "@/stores/toast";

type MedewerkerOptie = {
  id: string;
  emailadres: string;
  naam: string;
};

const contactverzoek = reactive<Contactverzoek>({
  bronorganisatie: window.organisatieIds[0],
  todo: {
    description: "",
    attendees: "",
  },
});

const nieuweKlant = reactive<NieuweKlant>({
  voornaam: "",
  voorvoegselAchternaam: "",
  achternaam: "",
  telefoonnummer: "",
  emailadres: "",
});

//available medewerkers

const contactmomentStore = useContactmomentStore();
const medewerkers = ref<MedewerkerOptie[]>([]);
const klantReadonly = computed(() => !!contactmomentStore.klant);
const form = ref<HTMLFormElement>();

const emailIsRequired = computed(
  () => !klantReadonly.value && !nieuweKlant.telefoonnummer
);

const emailRequiredMessage = computed(() =>
  emailIsRequired.value && !nieuweKlant.emailadres
    ? "Vul een minimaal een e-mailadres of een telefoonnummer van de klant in"
    : ""
);

watch(
  contactmomentStore.medewerkers,
  (newVal) => {
    const mapped = newVal.map(
      ({ achternaam, voornaam, voorvoegselAchternaam, emailadres, id }) => {
        return {
          id,
          emailadres,
          naam: [voornaam, voorvoegselAchternaam, achternaam]
            .filter(Boolean)
            .join(" "),
        };
      }
    );
    medewerkers.value = mapped;
    contactverzoek.todo.attendees = mapped[mapped.length - 1]?.emailadres;
  },
  { immediate: true }
);

watch(
  () => contactmomentStore.klant,
  (klant) => {
    nieuweKlant.voornaam = klant?.voornaam || "";
    nieuweKlant.voorvoegselAchternaam = klant?.voorvoegselAchternaam;
    nieuweKlant.achternaam = klant?.achternaam || "";
    nieuweKlant.emailadres = klant?.emailadres || "";
    nieuweKlant.telefoonnummer = klant?.telefoonnummer || "";
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

function submit() {
  if (!validate()) return false;
  contactmomentStore.contactverzoek = contactverzoek;
  if (!contactmomentStore.klant) {
    contactmomentStore.nieuweKlant = nieuweKlant;
  }
  return true;
}

defineExpose({ submit });
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
