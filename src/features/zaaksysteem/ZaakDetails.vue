<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1" model-value
        >Zaak {{ zaak.identificatie }}
      </utrecht-heading>
      <router-link :to="{ name: 'zaken' }">{{ "< Ga terug" }}</router-link>
    </div>

    <div class="toelichting">
      <utrecht-heading :level="3" model-value>
        <div class="toelichting-heading">
          <span>Toelichting</span>
          <button
            v-if="!isEditingToelichting"
            @click="toggleEditingToelichting"
            title="Bewerken"
            class="icon-after pen"
          />
          <simple-spinner class="spinner" v-if="formIsLoading" />
        </div>
      </utrecht-heading>

      <form class="new-note" @submit.prevent="submit">
        <textarea
          required
          :disabled="!isEditingToelichting"
          class="utrecht-textarea utrecht-textarea--html-textarea"
          rows="10"
          placeholder="Schrijf een nieuwe notitie bij de zaak"
          v-model="toelichtingInputValue"
        ></textarea>

        <menu v-if="isEditingToelichting">
          <utrecht-button
            :disabled="formIsLoading"
            modelValue
            @click="toggleEditingToelichting"
            type="button"
            appearance="secondary-action-button"
            >Annuleren</utrecht-button
          >
          <button
            :disabled="formIsLoading"
            class="utrecht-button utrecht-button--submit"
            type="submit"
          >
            Opslaan
          </button>
        </menu>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { ZaakDetails } from "./types";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import { toast } from "@/stores/toast";
import { updateToelichting } from "./service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { useContactmomentStore } from "@/stores/contactmoment";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const contactmomentStore = useContactmomentStore();

const formIsLoading = ref<boolean>(false);
const isEditingToelichting = ref<boolean>(false);
const toelichtingInputValue = ref<string>(props.zaak.toelichting);

const toggleEditingToelichting = () => {
  isEditingToelichting.value = !isEditingToelichting.value;
};

const submit = async () => {
  formIsLoading.value = true;

  updateToelichting(props.zaak, toelichtingInputValue.value)
    .then((res) => {
      toast({ text: "De notitie is opgeslagen." });
      contactmomentStore.addZaak(res, contactmomentStore.huidigeVraag);
    })
    .catch(() => {
      toelichtingInputValue.value = props.zaak.toelichting;

      toast({
        type: "error",
        text: "Oeps het lukt niet om deze notitie op te slaan. Probeer het later opnieuw.",
      });
    })
    .finally(() => {
      toggleEditingToelichting();
      formIsLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
.notes {
  gap: var(--spacing-large);
  display: flex;

  .current-notes {
    flex: 3;
  }

  .new-note {
    flex: 2;
  }
}

.new-note {
  > *:not(:last-child) {
    margin-block-end: var(--spacing-small);
  }

  menu {
    display: flex;
    gap: var(--spacing-small);
    float: right;
  }
}

.toelichting-heading {
  display: flex;

  button {
    all: unset;
    margin-inline-start: var(--spacing-default);

    &:hover {
      cursor: pointer;
    }
  }
}

.spinner {
  font-size: 16px;
  margin-inline-start: var(--spacing-default);
}
</style>
