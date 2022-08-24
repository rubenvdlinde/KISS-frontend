<template>
  <article>
    <div class="heading-container">
      <utrecht-heading model-value :level="level">
        <span class="heading"
          ><span>Klantgegevens</span>
          <button
            v-if="!editing"
            @click="toggleEditing"
            title="Bewerken"
            :class="'icon-after pen'"
            class="toggleEdit"
          ></button
        ></span>
      </utrecht-heading>

      <menu v-if="editing" class="buttons-container">
        <li>
          <button @click="reset" type="reset" class="annuleren">
            Annuleren
          </button>
        </li>
        <li>
          <utrecht-button modelValue type="submit" @click="submit"
            >Opslaan</utrecht-button
          >
        </li>
      </menu>
    </div>

    <form @submit.prevent="submit">
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
            <td v-if="editing">
              <span
                class="input-container"
                v-for="(tel, idx) in telefoonnummers"
                :key="idx"
              >
                <input
                  type="text"
                  v-model="tel.telefoonnummer"
                  class="utrecht-textbox utrecht-textbox--html-input"
                />
                <button
                  @click="removePhoneNumber(idx)"
                  type="button"
                  title="Telefoonnummer verwijderen"
                  class="icon-before xmark remove-item"
                />
              </span>
              <button
                title="Telefoonnummer toevoegen"
                type="button"
                @click="addPhoneNumber"
                class="add-item icon-after plus"
              />
            </td>
            <td v-else>
              {{
                telefoonnummers
                  .map(({ telefoonnummer }) => telefoonnummer)
                  .join(", ")
              }}
            </td>
            <td v-if="editing">
              <span
                class="input-container"
                v-for="(email, idx) in emails"
                :key="idx"
              >
                <input
                  type="email"
                  v-model="email.email"
                  class="utrecht-textbox utrecht-textbox--html-input"
                />
                <button
                  @click="removeEmail(idx)"
                  type="button"
                  title="Email verwijderen"
                  class="icon-before xmark remove-item"
                />
              </span>
              <button
                title="Email toevoegen"
                type="button"
                @click="addEmail"
                class="add-item icon-after plus"
              />
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
import { defineProps, ref, type PropType } from "vue";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import type { Klant } from "@/stores/contactmoment";
import { updateContactgegevens } from "./service";

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

const editing = ref<boolean>(false);

const toggleEditing = (): void => {
  editing.value = !editing.value;
};

const reset = () => {
  emails.value = clone(props.klant.emails);
  telefoonnummers.value = clone(props.klant.telefoonnummers);
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

const submit = () =>
  updateContactgegevens({
    id: props.klant.id,
    telefoonnummers: telefoonnummers.value,
    emails: emails.value,
  }).then(() => {
    editing.value = false;
  });
</script>

<style lang="scss" scoped>
article {
  background-color: var(--color-secondary);
  padding: var(--spacing-default);
}

table {
  width: 100%;
}

caption {
  padding-left: var(--spacing-default);
  padding-block: var(--spacing-small);
  margin-block: var(--spacing-small);
  text-align: left;
  font-size: var(--utrecht-typography-scale-lg);
  border-bottom: 1px solid var(--color-tertiary);
}
th,
td {
  width: 25%;
  text-align: left;
  padding-block: var(--spacing-default);
}

.heading-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .heading {
    display: flex;
    align-items: center;

    & > *:not(:last-child) {
      margin-inline-end: var(--spacing-small);
    }

    .toggleEdit {
      &:hover {
        cursor: pointer;
      }
    }
  }

  .buttons-container {
    display: flex;
    align-items: center;

    .annuleren {
      all: unset;
      text-decoration: underline;
      margin-inline-end: var(--spacing-default);

      &:hover {
        cursor: pointer;
      }
    }
  }
}

.input-container {
  display: flex;
  align-items: center;

  & > *:not(:last-child) {
    margin-inline-end: var(--spacing-small);
  }

  & > .remove-item:hover {
    cursor: pointer;
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

  &::after {
    height: 0.75rem;
    width: 0.75rem;
  }

  &:hover {
    cursor: pointer;
  }
}

.icon-after,
.icon-before {
  border: none;
}
</style>
