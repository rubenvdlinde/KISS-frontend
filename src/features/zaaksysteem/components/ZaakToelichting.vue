<template>
  <div class="toelichtingen-container">
    <div class="toelichtingen">
      <utrecht-heading :level="3" model-value>Toelichtingen</utrecht-heading>

      <p
        class="toelichting"
        v-for="(toelichting, idx) in toelichtingen"
        :key="idx"
      >
        {{ toelichting }}
      </p>
    </div>

    <form class="add-toelichting" @submit.prevent="submit">
      <div class="add-toelichting-heading">
        <utrecht-heading :level="3" model-value
          >Nieuwe toelichting
        </utrecht-heading>

        <simple-spinner v-if="formIsLoading" class="spinner" />
      </div>

      <textarea
        required
        :disabled="formIsLoading"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        rows="10"
        placeholder="Schrijf een nieuwe toelichting bij de zaak"
        v-model="newToelichtingInputValue"
      ></textarea>

      <button
        :disabled="formIsLoading"
        class="utrecht-button utrecht-button--submit"
        type="submit"
      >
        Opslaan
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
import type { ZaakDetails } from "./../types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { toast } from "@/stores/toast";
import { updateToelichting } from "./../service";
import SimpleSpinner from "../../../components/SimpleSpinner.vue";

const props = defineProps<{
  zaak: ZaakDetails;
}>();

const toelichtingen = ref<string[]>(props.zaak.toelichting.split("\n\n"));
const formIsLoading = ref<boolean>(false);
const newToelichtingInputValue = ref<string>("");

watch(
  () => props.zaak.toelichting,
  (toelichting) => {
    newToelichtingInputValue.value = toelichting;
  }
);

const submit = async () => {
  formIsLoading.value = true;

  const newToelichtingen = `${props.zaak.toelichting}\n\n${newToelichtingInputValue.value}`;

  updateToelichting(props.zaak, newToelichtingen)
    .then(() => {
      toast({ text: "De toelichting is opgeslagen." });
      toelichtingen.value = props.zaak.toelichting.split("\n\n");
      newToelichtingInputValue.value = "";
    })
    .catch(() => {
      newToelichtingInputValue.value = props.zaak.toelichting;

      toast({
        type: "error",
        text: "Oeps het lukt niet om deze toelichting op te slaan. Probeer het later opnieuw.",
      });
    })
    .finally(() => {
      formIsLoading.value = false;
    });
};
</script>

<style scoped lang="scss">
.toelichtingen-container {
  display: flex;
  gap: var(--spacing-large);
  justify-content: space-between;

  utrecht-heading {
    margin-block-end: var(--spacing-default);
  }

  .toelichtingen {
    flex: 3;

    .toelichting {
      padding-block: var(--spacing-small);
      padding-inline-start: var(--spacing-small);
      margin-block-end: var(--spacing-default);
      border-left: var(--spacing-extrasmall) solid var(--color-secondary);
    }
  }

  .add-toelichting {
    flex: 2;
    max-width: 600px;

    .add-toelichting-heading {
      display: flex;
      align-items: center;
      gap: var(--spacing-default);

      .spinner {
        margin: 0;
        bottom: var(--spacing-small);
        font-size: var(--spacing-default);
      }
    }
  }
}
</style>
