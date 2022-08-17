<template>
  <p v-if="submitted">
    Contactverzoek verstuurd naar
    {{ contactmomentStore.contactverzoek?.medewerker }}
  </p>
  <SimpleSpinner v-else-if="loading" />
  <p v-else-if="error">Er ging iets mis. Probeer het later nog eens.</p>
  <form @submit.prevent="submit" ref="form" v-else>
    <fieldset class="utrecht-form-fieldset">
      <medewerker-search
        class="utrecht-textbox utrecht-textbox--html-input"
        v-model="attendee"
        required
      >
        <template #label
          ><span class="required utrecht-form-label"
            >Contactverzoek versturen naar</span
          ></template
        >
      </medewerker-search>
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
          v-model="emailadres"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 1 van de klant
        <input
          type="tel"
          v-model="telefoonnummer1"
          class="utrecht-textbox utrecht-textbox--html-input"
          pattern="(^\+[0-9]{2}|^\+[0-9]{2}\(0\)|^\(\+[0-9]{2}\)\(0\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\-\s]{10}$)"
          title="Vul een valide Nederlands telefoonnummer in"
          :disabled="klantReadonly"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 2 van de klant
        <input
          type="tel"
          v-model="telefoonnummer2"
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
        v-model="contactverzoek.todo.description"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        required
      />
    </label>

    <utrecht-button model-value type="submit" v-if="!submitted">
      Contactverzoek opslaan
    </utrecht-button>
  </form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import {
  useContactmomentStore,
  type NieuweKlant,
} from "@/stores/contactmoment";
import { saveContactverzoek, type Contactverzoek } from "./service";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { createKlant } from "../klant/service";
import { koppelKlant } from "../contactmoment";
import MedewerkerSearch from "../search/MedewerkerSearch.vue";
import SimpleSpinner from "../../components/SimpleSpinner.vue";

const attendee = ref("");
const loading = ref(false);
const error = ref(false);

const contactverzoek = reactive<Contactverzoek>({
  bronorganisatie: window.organisatieIds[0],
  todo: {
    description: "",
    attendees: [],
    name: "contactverzoek",
  },
});

const nieuweKlant = reactive<NieuweKlant>({
  voornaam: "",
  voorvoegselAchternaam: "",
  achternaam: "",
  telefoonnummers: [],
  emails: [],
});

const telefoonnummer1 = ref("");
const telefoonnummer2 = ref("");
const emailadres = ref("");

//available medewerkers

const contactmomentStore = useContactmomentStore();
const submitted = computed(() => !!contactmomentStore.contactverzoek);
const klantReadonly = computed(
  () => submitted.value || !!contactmomentStore.klant
);
const form = ref<HTMLFormElement>();

const emailIsRequired = computed(
  () => !klantReadonly.value && !telefoonnummer1.value && !telefoonnummer2.value
);

const emailRequiredMessage = computed(() =>
  emailIsRequired.value && !emailadres.value
    ? "Vul een minimaal een e-mailadres of een telefoonnummer van de klant in"
    : ""
);

watch(attendee, (a) => {
  contactverzoek.todo.attendees = a ? [a] : [];
});

watch(
  () => contactmomentStore.klant,
  (klant) => {
    nieuweKlant.voornaam = klant?.voornaam || "";
    nieuweKlant.voorvoegselAchternaam = klant?.voorvoegselAchternaam;
    nieuweKlant.achternaam = klant?.achternaam || "";
    emailadres.value = klant?.emails?.[0] || "";
    telefoonnummer1.value = klant?.telefoonnummers?.[0] || "";
    telefoonnummer2.value = klant?.telefoonnummers?.[1] || "";
  },
  { immediate: true }
);

watch(
  () => contactmomentStore.notitie,
  (n, o) => {
    if (
      n &&
      (!contactverzoek.todo.description ||
        contactverzoek.todo.description === o)
    ) {
      contactverzoek.todo.description = n;
    }
  },
  { immediate: true }
);

function validate() {
  if (!form.value) return false;

  const emailInput = form.value.elements.namedItem("klant-email");

  if (emailInput instanceof HTMLInputElement) {
    emailInput.setCustomValidity(emailRequiredMessage.value);
  }

  return form.value.reportValidity();
}

async function submit() {
  try {
    if (submitted.value || !validate()) return;

    loading.value = true;

    if (!contactmomentStore.klant) {
      nieuweKlant.telefoonnummers = [
        telefoonnummer1.value,
        telefoonnummer2.value,
      ].filter(Boolean);

      nieuweKlant.emails = emailadres.value ? [emailadres.value] : [];

      const klant = await createKlant(nieuweKlant);
      contactmomentStore.setKlant(klant);
    }
    const klantId = contactmomentStore.klant?.id;
    if (!klantId) {
      throw new Error("kan klant niet koppelen, id ontbreekt");
    }

    const result = await saveContactverzoek(contactverzoek);
    await koppelKlant({ klantId, contactmomentId: result.id });

    contactmomentStore.contactverzoek = {
      url: result.url,
      medewerker: contactverzoek.todo.attendees[0],
    };
  } catch (e) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
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
