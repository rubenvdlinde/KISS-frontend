<template>
  <article>
    <div class="heading-container">
      <utrecht-heading model-value :level="level">
        <span class="heading"
          ><span>Klantgegevens</span>
          <span
            @click="toggleEditing"
            :class="!editing && 'icon-after pen'"
            class="toggleEdit"
          ></span
        ></span>
      </utrecht-heading>

      <div v-if="editing" class="buttons-container">
        <button @click="toggleEditing" class="annuleren">Annuleren</button>

        <utrecht-button modelValue>Opslaan</utrecht-button>
      </div>
    </div>

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
            {{
              klant.telefoonnummers
                .map(({ telefoonnummer }) => telefoonnummer)
                .join(", ")
            }}
          </td>
          <td v-if="editing">
            <span
              class="input-container"
              v-for="(email, idx) in klant.emails"
              :key="idx"
              ><input
                type="email"
                v-model="email.email"
                class="utrecht-textbox utrecht-textbox--html-input"
              />
              <span
                @click="removeEmail"
                class="icon-before xmark remove-item"
              />
            </span>

            <span @click="addEmail" class="add-item icon-after plus" />
          </td>
          <td v-if="!editing">
            {{ klant.emails.map(({ email }) => email).join(", ") }}
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
import { defineProps, ref, type PropType } from "vue";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import type { Klant } from "@/stores/contactmoment";

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

const emails = ref(props.klant.emails);

const editing = ref<boolean>(false);

const toggleEditing = (): void => {
  editing.value = !editing.value;
};

const addEmail = (): void => {
  if (emails.value[emails.value.length - 1].email === "") return;

  emails.value.push({ email: "" });
};

const removeEmail = (event: Event): void => {
  // console.log(event.target.value);
};
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

    & > .annuleren {
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
  border-radius: var(--spacing-default);
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
</style>
