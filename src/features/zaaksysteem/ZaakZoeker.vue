<template>
  <section class="grid">
    <form @submit.prevent="zoek">
      <fieldset class="utrecht-form-fieldset">
        <label for="zaaknummer" class="utrecht-form-label">Zaaknummer</label>
        <input
          type="text"
          id="zaaknummer"
          v-model="zaaknummer"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoek"
        />
      </fieldset>
      todo minimaal x aantal karaters....
      <menu>
        <utrecht-button modelValue type="submit">Zoek</utrecht-button>
      </menu>
    </form>

    <section>
      <application-message
        v-if="error"
        messageType="error"
        message="Er is een probleem opgetreden."
      ></application-message>

      <table v-else-if="zaken.length > 0">
        <thead>
          <th>Zaaknummer</th>
          <th>Zaaktype</th>
          <th>Status</th>
          <th>Datum ingediend</th>
        </thead>
        <tbody>
          <tr v-for="zaak in zaken" :key="zaak.id">
            <td>{{ zaak.identificatie }}</td>
            <td>{{ zaak.zaaktype }}</td>
            <td>{{ zaak.status }}</td>
            <td>{{ zaak.registratiedatum }}</td>
          </tr>
        </tbody>
      </table>

      <paragraph v-else-if="isDirty">Er zijn geen zaken gevonden.</paragraph>

      <simple-spinner v-else-if="busy"></simple-spinner>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useZaaksysteemService } from "./service";
import type { Zaak } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";

const service = useZaaksysteemService();
const zaaknummer = ref();
const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);
const zaken = ref<Zaak[]>([]);

const zoek = () => {
  busy.value = true;
  error.value = false;
  zaken.value = [];

  service
    .find(zaaknummer.value)
    .then((data) => {
      console.log(data);
      zaken.value = data;
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

menu {
  margin-top: var(--spacing-large);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

th,
td {
  padding-top: var(--spacing-small);
  padding-bottom: var(--spacing-small);
  padding-left: var(--spacing-small);
  padding-right: var(--spacing-small);
}

th {
  text-align: left;
}
</style>
