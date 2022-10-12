<template>
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

  <form class="edit-toelichting" @submit.prevent="submit">
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
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import type { ZaakDetails } from "./../types";
import {
  UtrechtHeading,
  UtrechtButton,
} from "@utrecht/web-component-library-vue";
import { toast } from "@/stores/toast";
import { updateToelichting } from "./../service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const emit = defineEmits(["zaakUpdated"]);

const formIsLoading = ref<boolean>(false);
const isEditingToelichting = ref<boolean>(false);
const toelichtingInputValue = ref<string>(props.zaak.toelichting);

watch(
  () => props.zaak.toelichting,
  (toelichting) => {
    toelichtingInputValue.value = toelichting;
  }
);

const toggleEditingToelichting = () => {
  isEditingToelichting.value = !isEditingToelichting.value;
};

const submit = async () => {
  formIsLoading.value = true;

  updateToelichting(props.zaak, toelichtingInputValue.value)
    .then(() => {
      toast({ text: "De notitie is opgeslagen." });
      emit("zaakUpdated");
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
.edit-toelichting {
  max-width: 600px;

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
