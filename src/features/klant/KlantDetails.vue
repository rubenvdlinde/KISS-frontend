<template>
  <article>
    <non-blocking-form @submit.prevent="submit">
      <header class="heading-container">
        <utrecht-heading model-value :level="level">
          <span class="heading">
            Klantgegevens
            <button
              v-if="!editing"
              @click="toggleEditing"
              title="Bewerken"
              :class="'icon-after pen'"
              class="toggleEdit"
            />
            <simple-spinner class="spinner" v-if="submitter.loading" />
            <application-message
              v-else-if="submitter.error"
              class="error-message"
              message="Er ging iets mis. Probeer het later nog eens"
              :auto-close="true"
              message-type="error"
            />
          </span>
        </utrecht-heading>

        <menu v-if="showForm" class="buttons-container">
          <li>
            <button @click="reset" type="reset" class="annuleren">
              Annuleren
            </button>
          </li>
          <li>
            <utrecht-button modelValue type="submit">Opslaan</utrecht-button>
          </li>
        </menu>
      </header>
      <table>
        <thead>
          <tr>
            <th>Klantnummer</th>
            <th>Naam</th>
            <th>Telefoonnummer(s)</th>
            <th>E-mailadres(sen)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ klant.klantnummer }}</td>
            <td>
              {{
                [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
                  .filter((x) => x)
                  .join(" ")
              }}
            </td>
            <td>
              <fieldset class="in-cell-edit" v-if="showForm">
                <template v-for="(tel, idx) in telefoonnummers" :key="tel">
                  <div>
                    <non-blocking-errors
                      :value="tel.telefoonnummer"
                      :validate="customPhoneValidator"
                    >
                      <template #default>
                        <input
                          v-model="tel.telefoonnummer"
                          type="tel"
                          :name="`Telefoonnummer ${idx + 1}`"
                          :aria-label="`Telefoonnummer ${idx + 1}`"
                          required
                          class="utrecht-textbox utrecht-textbox--html-input"
                        />
                      </template>
                    </non-blocking-errors>
                  </div>
                  <button
                    @click="removePhoneNumber(idx)"
                    type="button"
                    title="Telefoonnummer verwijderen"
                    class="icon-before xmark remove-item"
                  />
                </template>
                <button
                  v-show="canAddPhone"
                  title="Telefoonnummer toevoegen"
                  type="button"
                  @click="addPhoneNumber"
                  class="add-item icon-after plus"
                />
              </fieldset>
              <ul v-else>
                <li
                  v-for="({ telefoonnummer }, idx) in telefoonnummers"
                  :key="idx"
                >
                  {{ telefoonnummer }}
                </li>
              </ul>
            </td>
            <td>
              <fieldset class="in-cell-edit" v-if="showForm">
                <template v-for="(email, idx) in emails" :key="email">
                  <input
                    v-email
                    v-model="email.email"
                    :aria-label="`E-mailadres ${idx + 1}`"
                    class="utrecht-textbox utrecht-textbox--html-input"
                    required
                  />
                  <button
                    @click="removeEmail(idx)"
                    type="button"
                    title="E-mail verwijderen"
                    class="icon-before xmark remove-item"
                  />
                </template>
                <button
                  title="E-mail toevoegen"
                  type="button"
                  @click="addEmail"
                  v-show="canAddEmail"
                  class="add-item icon-after plus"
                />
              </fieldset>
              <ul v-else>
                <li v-for="({ email }, idx) in emails" :key="idx">
                  {{ email }}
                </li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </non-blocking-form>
  </article>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch, type PropType } from "vue";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import type { Klant } from "./types";
import { useUpdateContactGegevens } from "./service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
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
  () => reset(),
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
    });

const showForm = computed(() => !submitter.loading && editing.value);
</script>

<style lang="scss" scoped>
article {
  background-color: var(--color-secondary);
  padding: var(--spacing-default);
}

table {
  width: 100%;
  margin-top: var(--spacing-default);
}

th,
td {
  width: 25%;
  text-align: left;
  padding-inline: var(--spacing-small);
}

.heading-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .heading {
    display: flex;
    align-items: center;
    gap: var(--spacing-default);
  }

  .buttons-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-default);

    .annuleren {
      all: unset;
      text-decoration: underline;
    }
  }
}

.add-item {
  display: flex;
  color: white;
  width: fit-content;
  background-color: var(--color-primary);
  border-radius: var(--radius-medium);
  padding-inline-start: var(--spacing-default);
  padding-inline-end: var(--spacing-default);
  padding-block-start: var(--spacing-small);
  padding-block-end: var(--spacing-small);
  margin-inline-start: auto;

  &::after {
    inline-size: 0.75rem;
    block-size: 0.75rem;
  }
}

.icon-after,
.icon-before {
  border: none;
}

.spinner {
  font-size: 16px;
}

.error-message {
  font-size: 50%;
}

.in-cell-edit {
  gap: var(--spacing-small);
  display: grid;
  grid-template-columns: 1fr min-content;
}
</style>
