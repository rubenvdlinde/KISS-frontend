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

      <div v-else-if="zaak">
        {{ zaak }}
      </div>

      <paragraph v-else-if="isDirty">Er is geen zaak gevonden.</paragraph>

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

const service = useZaaksysteemService();
const zaaknummer = ref();
const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);
const zaak = ref<Zaak | null>(null);

const zoek = () => {
  busy.value = true;
  error.value = false;
  zaak.value = null;

  service
    .find(zaaknummer.value)
    .then((data) => {
      console.log(data);
      zaak.value = data;
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
  background-color: var(--color-secondary);
  padding: var(--spacing-large);
  grid-gap: 2rem;
}

fieldset {
  display: grid;
  align-items: center;
  grid-template-rows: 1fr 1fr;

}

label {
  grid-column: 1 / 2;
}

menu {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
