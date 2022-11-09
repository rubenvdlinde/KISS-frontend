<template>
  <article class="details-block">
    <non-blocking-form @submit.prevent="submit">
      <header class="heading-container">
        <utrecht-heading :level="level">
          <span class="heading">
            Gegevens klant
            <utrecht-button
              v-if="!editing"
              appearance="subtle-button"
              @click="toggleEditing"
              title="Bewerken"
              :class="'icon-after icon-only pen'"
              class="toggleEdit"
            />
            <simple-spinner class="spinner" v-if="submitter.loading" />
            <application-message
              v-else-if="submitter.error"
              class="error-message"
              message="Er ging iets mis. Probeer het later nog eens."
              :auto-close="true"
              message-type="error"
            />
          </span>
        </utrecht-heading>

        <menu v-if="showForm" class="buttons-container">
          <li>
            <utrecht-button
              @click="reset"
              type="reset"
              appearance="secondary-action-button"
            >
              Annuleren
            </utrecht-button>
          </li>
          <li>
            <utrecht-button appearance="primary-action-button" type="submit"
              >Opslaan</utrecht-button
            >
          </li>
        </menu>
      </header>
      <dl>
        <dt>Klantnummer</dt>
        <dd>{{ klant.klantnummer }}</dd>
        <dt>E-mailadres{{ emails.length > 1 ? "sen" : "" }}</dt>
        <dd v-for="(email, idx) in emails" :key="idx">
          <fieldset v-if="showForm">
            <input
              v-model="email.email"
              type="email"
              :name="`E-mail ${idx + 1}`"
              :aria-label="`E-mail ${idx + 1}`"
              required
              class="utrecht-textbox utrecht-textbox--html-input"
            />
            <utrecht-button
              appearance="subtle-button"
              @click="removeEmail(idx)"
              type="button"
              title="E-mail verwijderen"
              class="icon-before xmark remove-item icon-only"
            />
          </fieldset>
          <template v-else>{{ email.email }}</template>
        </dd>
        <dd v-if="showForm">
          <utrecht-button
            appearance="primary-action-button"
            :title="
              canAddEmail ? 'E-mail toevoegen' : 'Vul eerst het lege veld in'
            "
            :disabled="!canAddEmail"
            type="button"
            @click="addEmail"
            class="add-item icon-after plus icon-only"
          />
        </dd>
        <dt>Telefoonnummer{{ telefoonnummers.length > 1 ? "s" : "" }}</dt>
        <dd v-for="(tel, idx) in telefoonnummers" :key="idx">
          <fieldset v-if="showForm">
            <non-blocking-errors
              :value="tel.telefoonnummer"
              :validate="customPhoneValidator"
            />
            <input
              v-model="tel.telefoonnummer"
              type="tel"
              :name="`Telefoonnummer ${idx + 1}`"
              :aria-label="`Telefoonnummer ${idx + 1}`"
              required
              class="utrecht-textbox utrecht-textbox--html-input"
            />
            <utrecht-button
              appearance="subtle-button"
              @click="removePhoneNumber(idx)"
              type="button"
              title="Telefoonnummer verwijderen"
              class="icon-before xmark remove-item icon-only"
            />
          </fieldset>
          <template v-else>{{ tel.telefoonnummer }}</template>
        </dd>
        <dd v-if="showForm">
          <utrecht-button
            appearance="primary-action-button"
            :title="
              canAddPhone
                ? 'Telefoonnummer toevoegen'
                : 'Vul eerst het lege veld in'
            "
            :disabled="!canAddPhone"
            type="button"
            @click="addPhoneNumber"
            class="add-item icon-after plus icon-only"
          />
        </dd>
      </dl>
    </non-blocking-form>
  </article>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, type PropType } from "vue";
import {
  Heading as UtrechtHeading,
  Button as UtrechtButton,
} from "@utrecht/component-library-vue";
import type { Klant } from "../types";
import { useUpdateContactGegevens } from "../service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { computed } from "vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import {
  NonBlockingErrors,
  NonBlockingForm,
} from "@/components/non-blocking-forms";
import { customPhoneValidator } from "@/helpers/validation";

const props = defineProps({
  klant: {
    type: Object as PropType<Klant>,
    required: true,
  },
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 2,
  },
});

// we clone the emails and phone numbers, so we don't directly edit the Klant object on the contactmoment store.
// this means we can easily reset unsaved changes
function clone<T>(val: T[]): T[] {
  return val.map((x) => Object.assign({}, x));
}

const emails = ref(clone(props.klant.emails));
const telefoonnummers = ref(clone(props.klant.telefoonnummers));

function populate() {
  emails.value = clone(props.klant.emails);
  telefoonnummers.value = clone(props.klant.telefoonnummers);
}

function focusLastInput(e: Event) {
  nextTick(() => {
    if (
      e.target instanceof HTMLElement &&
      e.target.parentElement instanceof HTMLElement
    ) {
      const inputs = e.target.parentElement.getElementsByTagName("input");
      const last = inputs[inputs.length - 1];
      if (last instanceof HTMLElement) {
        last.focus();
      }
    }
  });
}

watch(
  () => props.klant,
  () => {
    if (!editing.value) {
      reset();
    }
  },
  { deep: true }
);

const editing = ref<boolean>(false);

const toggleEditing = (): void => {
  editing.value = !editing.value;
};

const reset = () => {
  submitter.reset();
  populate();
  editing.value = false;
};

const addEmail = (e: Event): void => {
  emails.value.push({ email: "" });
  focusLastInput(e);
};

const removeEmail = (i: number): void => {
  emails.value.splice(i, 1);
};

const canAddEmail = computed(() => {
  const emailArr = emails.value;
  return !emailArr.length || emailArr[emailArr.length - 1]?.email !== "";
});

const addPhoneNumber = (e: Event): void => {
  telefoonnummers.value.push({ telefoonnummer: "" });
  focusLastInput(e);
};

const removePhoneNumber = (i: number): void => {
  telefoonnummers.value.splice(i, 1);
};

const canAddPhone = computed(() => {
  const phoneArr = telefoonnummers.value;
  return (
    !phoneArr.length || phoneArr[phoneArr.length - 1]?.telefoonnummer !== ""
  );
});

const submitter = useUpdateContactGegevens();

const submit = () =>
  submitter
    .submit({
      id: props.klant.id,
      telefoonnummers: telefoonnummers.value,
      emails: emails.value,
    })
    .then((response) => {
      Object.assign(props.klant, response);
      editing.value = false;
    });

const showForm = computed(() => !submitter.loading && editing.value);
</script>

<style lang="scss" scoped>
.heading-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-small);
  }

  .buttons-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-default);
  }
}

.add-item {
  display: flex;
  color: white;
  margin-inline-start: auto;
}

.spinner {
  font-size: 16px;
}

.error-message {
  font-size: 50%;
}

dd fieldset {
  // flex seems to mess up icons
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing-default);
  align-items: center;
}

:disabled {
  cursor: not-allowed;
}
</style>
