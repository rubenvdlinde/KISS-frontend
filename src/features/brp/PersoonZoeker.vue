<template>
  <section class="grid">
    <section>
      <form @submit.prevent="zoekOpNaam">
        <label for="achternaam" class="utrecht-form-label">Achternaam</label>
        <input
          type="text"
          id="achternaam"
          v-model="achternaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpNaam"
        />
        <label for="geboortedatum" class="utrecht-form-label"
          >Geboortedatum</label
        >
        <input
          type="text"
          id="geboortedatum"
          v-model="geboortedatum"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpNaam"
        />

        <menu>
          <utrecht-button modelValue type="submit">Zoek</utrecht-button>
        </menu>
      </form>

      <form @submit.prevent="zoekOpAdres">
        <label for="postcode" class="utrecht-form-label">Postcode</label>
        <input
          type="text"
          id="postcode"
          v-model="postcode"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpAdres"
        />
        <label for="huisnummer" class="utrecht-form-label">Huisnummer</label>
        <input
          type="text"
          id="huisnummer"
          v-model="huisnummer"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpAdres"
        />

        <menu>
          <utrecht-button modelValue type="submit">Zoek</utrecht-button>
        </menu>
      </form>
    </section>
    <section>
      <application-message
        v-if="error"
        messageType="error"
        message="Er is een probleem opgetreden."
      ></application-message>

      <div v-else-if="personen">
        {{ personen }}
      </div>

      <paragraph v-else-if="isDirty">Er is geen zaak gevonden.</paragraph>

      <simple-spinner v-else-if="busy"></simple-spinner>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useBrpService } from "./service";
import type { Persoon } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";

const service = useBrpService();
const achternaam = ref();
const geboortedatum = ref();
const postcode = ref();
const huisnummer = ref();
const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);
const personen = ref<Persoon | null>(null); //todo array

const zoekOpNaam = () => {
  busy.value = true;
  error.value = false;
  personen.value = null;

  service
    .findByNameAndBirthDay(achternaam.value, geboortedatum.value)
    .then((data) => {
      console.log(data);
      personen.value = data;
      isDirty.value = true;
    })
    .catch(() => {
      error.value = true;
    })
    .finally(() => {
      busy.value = false;
    });
};

const zoekOpAdres = () => {
  busy.value = true;
  error.value = false;
  personen.value = null;

  service
    .findByNameAndBirthDay(achternaam.value, geboortedatum.value)
    .then((data) => {
      console.log(data);
      personen.value = data;
      isDirty.value = true;
    })
    .catch(() => {
      error.value = true;
    })
    .finally(() => {
      busy.value = false;
    });
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

.grid {
  display: grid;
  grid-template-columns: 1fr 4fr;

  padding: var(--spacing-large);
  grid-gap: 2rem;
}

label {
  display: inline-block;
  margin-top: var(--spacing-default);
}

input {
  margin-top: var(--spacing-small);
}

form:last-child {
   margin-top: var(--spacing-large);
}

menu {
  margin-top: var(--spacing-large);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
