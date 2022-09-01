<!--
nb. de gekozen oplossing met het vullen van de klant gegevens obv de 
geselecteerde klant in de klantstore levert in bepaalde edge cases problemen op
zo kan een dezelfde klant niet meer geselecteerd worden nadat deze is 
verwijderd uit het formulier. (de verwijder optie is nodig omdat je
anders niet meer vrij klantgegevens kan invullen als er toevallig al 
een klant geselecteerd was in het contact moment. het is mogelijk dat je 
bv een klant electeert om er vervolgens achter te komen dat dit toch niet
de juiste persoon is)

het zou beter zijn als alle tijdens het contactmoment gevonden klanten hier
uit een lijst geselecteerd zouden kunnen worden, met een 'anders namelijk' optie 
erbij voor het vrij invullen. 

-->
<template>
  <utrecht-heading model-value :level="2">Contactverzoek maken</utrecht-heading>
  <p v-if="submitted">
    Contactverzoek verstuurd naar
    {{ contactmomentStore.contactverzoek?.medewerker }}
  </p>
  <SimpleSpinner v-else-if="loading" />
  <p v-else-if="error">Er ging iets mis. Probeer het later nog eens.</p>
  <non-blocking-form @submit.prevent="submit" class="form" v-else>
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
          @input="isDirtyCheck"
        />
      </label>

      <label class="utrecht-form-label">
        <span>Tussenvoegsel van de klant</span>
        <input
          type="text"
          v-model="nieuweKlant.voorvoegselAchternaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="klantReadonly"
          @input="isDirtyCheck"
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
          @input="isDirtyCheck"
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
          @input="isDirtyCheck"
        />
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 1 van de klant
        <input
          v-if="klantReadonly"
          type="tel"
          :value="telefoonnummer1"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="true"
        />
        <non-blocking-errors
          :validate="customPhoneValidator"
          :value="telefoonnummer1"
          v-else
        >
          <template #default="{ inputProps }">
            <input
              v-bind="inputProps"
              type="tel"
              v-model="telefoonnummer1"
              class="utrecht-textbox utrecht-textbox--html-input"
              @input="isDirtyCheck"
            />
          </template>
        </non-blocking-errors>
      </label>

      <label class="utrecht-form-label">
        Telefoonnummer 2 van de klant
        <input
          v-if="klantReadonly"
          type="tel"
          :value="telefoonnummer2"
          class="utrecht-textbox utrecht-textbox--html-input"
          :disabled="true"
        />
        <non-blocking-errors
          :value="telefoonnummer2"
          :validate="customPhoneValidator"
          v-else
        >
          <template #default="{ inputProps }">
            <input
              v-bind="inputProps"
              type="tel"
              v-model="telefoonnummer2"
              class="utrecht-textbox utrecht-textbox--html-input"
              @input="isDirtyCheck"
            />
          </template>
        </non-blocking-errors>
      </label>

      <button
        v-if="klantReadonly"
        type="button"
        @click.prevent="wisGeselecteerdeKlant"
        class="utrecht-button utrecht-button--secondary-action"
        tabindex="-1"
      >
        Verwijder deze klantgegevens uit het contactverzoek
      </button>
    </fieldset>

    <label class="utrecht-form-label notitieveld">
      <span class="required">Notitie bij het contactverzoek</span>
      <textarea
        v-model="contactverzoek.todo.description"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        required
        @input="isDirtyCheck"
      />
    </label>

    <application-message
      v-if="emailRequiredMessage"
      :message="emailRequiredMessage"
      messageType="error"
    />

    <utrecht-button model-value type="submit" v-if="!submitted">
      Contactverzoek versturen
    </utrecht-button>
  </non-blocking-form>
</template>

<script lang="ts" setup>
import { ref, reactive, watch, computed } from "vue";
import {
  useContactmomentStore,
  type NieuweKlant,
} from "@/stores/contactmoment";
import {
  saveContactverzoek,
  createKlant,
  type Contactverzoek,
} from "./service";
import {
  UtrechtButton,
  UtrechtHeading,
} from "@utrecht/web-component-library-vue";
import { koppelKlant } from "../contactmoment";
import MedewerkerSearch from "../search/MedewerkerSearch.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import {
  NonBlockingForm,
  NonBlockingErrors,
} from "@/components/non-blocking-forms";
import { customPhoneValidator } from "@/helpers/validation";

const attendee = ref("");
const loading = ref(false);
const error = ref(false);
const useKlantFromStore = ref(false);

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
  () => submitted.value || useKlantFromStore.value
);
const emailIsRequired = computed(
  () =>
    !klantReadonly.value &&
    !telefoonnummer1.value &&
    !telefoonnummer2.value &&
    !emailadres.value
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
    emailadres.value = klant?.emails?.[0]?.email || "";
    telefoonnummer1.value = klant?.telefoonnummers?.[0]?.telefoonnummer || "";
    telefoonnummer2.value = klant?.telefoonnummers?.[1]?.telefoonnummer || "";
    useKlantFromStore.value = klant != null;

    if (klant) {
      emit("isDirty", true);
    }
  },
  { immediate: true, deep: true }
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
      emit("isDirty", true);
    }
  },
  { immediate: true }
);

async function submit() {
  try {
    if (submitted.value || emailRequiredMessage.value) return;

    loading.value = true;

    var klantId = "";

    if (!contactmomentStore.klant) {
      nieuweKlant.telefoonnummers = [
        telefoonnummer1.value,
        telefoonnummer2.value,
      ]
        .filter(Boolean)
        .map((telefoonnummer) => ({ telefoonnummer }));

      nieuweKlant.emails = emailadres.value
        ? [{ email: emailadres.value }]
        : [];

      const newKlantResult = await createKlant(nieuweKlant);
      klantId = newKlantResult.id;
    } else {
      klantId = contactmomentStore.klant?.id;
    }

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
    emit("isDirty", false);
  }
}

const wisGeselecteerdeKlant = () => {
  nieuweKlant.voornaam = "";
  nieuweKlant.voorvoegselAchternaam = "";
  nieuweKlant.achternaam = "";
  nieuweKlant.telefoonnummers = [];
  nieuweKlant.emails = [];
  emailadres.value = "";
  telefoonnummer1.value = "";
  telefoonnummer2.value = "";

  useKlantFromStore.value = false;
};

const emit = defineEmits(["isDirty"]);
const isDirtyCheck = (e: any) => {
  if (e.target.value !== "") {
    emit("isDirty", true);
  }
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

menu {
  display: flex;

  justify-content: flex-end;
}

.error,
.confirm {
  margin-top: var(--spacing-default);
}

//hack: non-blocking-form styling
* + :deep(form) {
  flex: 1;
  display: flex;
  gap: var(--spacing-default);
  flex-direction: column;
}

fieldset {
  --gap: var(--spacing-default);
  gap: var(--gap);
  display: grid;

  &::after {
    content: "";
    margin-inline: calc(-1 * var(--gap));
    height: 0.5rem;
    background-color: var(--color-tertiary);
  }
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

.notitieveld,
textarea {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.notitieveld textarea.utrecht-textarea {
  padding: var(--spacing-small);
  margin-block-start: 0;
  min-height: 20rem;
}

utrecht-heading {
  margin-block-end: var(--spacing-default);
}

utrecht-button {
  --utrecht-button-min-inline-size: 100%;
  --utrecht-button-min-block-size: 3rem;
}
</style>
