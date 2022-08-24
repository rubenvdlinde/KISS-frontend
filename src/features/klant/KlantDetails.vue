<template>
  <article>
    <form @submit.prevent="submit">
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
            <td v-if="showForm">
              <span class="in-cell-edit">
                <template v-for="(tel, idx) in telefoonnummers" :key="idx">
                  <custom-phone-input
                    v-model="tel.telefoonnummer"
                    required
                    class="utrecht-textbox utrecht-textbox--html-input"
                  />
                  <button
                    @click="removePhoneNumber(idx)"
                    type="button"
                    title="Telefoonnummer verwijderen"
                    class="icon-before xmark remove-item"
                  />
                </template>
                <button
                  title="Telefoonnummer toevoegen"
                  type="button"
                  @click="addPhoneNumber"
                  class="add-item icon-after plus"
                />
              </span>
            </td>
            <td v-else>
              {{
                telefoonnummers
                  .map(({ telefoonnummer }) => telefoonnummer)
                  .join(", ")
              }}
            </td>
            <td v-if="showForm">
              <span class="in-cell-edit">
                <template v-for="(email, idx) in emails" :key="idx">
                  <input
                    type="email"
                    v-model="email.email"
                    class="utrecht-textbox utrecht-textbox--html-input"
                    required
                  />
                  <button
                    @click="removeEmail(idx)"
                    type="button"
                    title="Email verwijderen"
                    class="icon-before xmark remove-item"
                  />
                </template>
                <button
                  title="Email toevoegen"
                  type="button"
                  @click="addEmail"
                  class="add-item icon-after plus"
                />
              </span>
            </td>
            <td v-else>
              {{ emails.map(({ email }) => email).join(", ") }}
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </article>
</template>

<script lang="ts" setup>
import { ref, watch, type PropType } from "vue";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import type { Klant } from "@/stores/contactmoment";
import { useUpdateContactGegevens } from "./service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { computed } from "@vue/reactivity";
import ApplicationMessage from "../../components/ApplicationMessage.vue";
import CustomPhoneInput from "../../components/CustomPhoneInput.vue";

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

function populate(k: Klant) {
  emails.value = clone(k.emails);
  telefoonnummers.value = clone(k.telefoonnummers);
}

watch(() => props.klant, populate);

const editing = ref<boolean>(false);

const toggleEditing = (): void => {
  editing.value = !editing.value;
};

const reset = () => {
  populate(props.klant);
  editing.value = false;
};

const addEmail = (): void => {
  if (emails.value[emails.value.length - 1].email === "") return;

  emails.value.push({ email: "" });
};

const removeEmail = (i: number): void => {
  emails.value.splice(i, 1);
};

const addPhoneNumber = (): void => {
  if (
    telefoonnummers.value[telefoonnummers.value.length - 1]?.telefoonnummer ===
    ""
  )
    return;

  telefoonnummers.value.push({ telefoonnummer: "" });
};

const removePhoneNumber = (i: number): void => {
  telefoonnummers.value.splice(i, 1);
};

const submitter = useUpdateContactGegevens();

const submit = () =>
  submitter
    .submit({
      id: props.klant.id,
      telefoonnummers: telefoonnummers.value,
      emails: emails.value,
    })
    .then((response) => {
      editing.value = false;
      Object.assign(props.klant, response);
      populate(props.klant);
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
