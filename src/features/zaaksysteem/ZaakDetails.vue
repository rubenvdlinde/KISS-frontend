<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1" model-value
        >Zaak {{ zaak.identificatie }}</utrecht-heading
      >
      <router-link :to="{ name: 'zaken' }">{{ "< Ga terug" }}</router-link>
    </div>

    <div class="notes">
      <div class="current-notes">
        <utrecht-heading :level="3" model-value>Notities</utrecht-heading>
      </div>

      <form class="new-note" @submit.prevent="submit">
        <textarea
          required
          type="text"
          class="utrecht-textarea utrecht-textarea--html-textarea"
          rows="10"
          placeholder="Schrijf een nieuwe notitie bij de zaak"
          v-model="noteInputValue"
        ></textarea>

        <button class="utrecht-button utrecht-button--submit" type="submit">
          Opslaan
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import type { ZaakDetails } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { toast } from "@/stores/toast";

defineProps<{
  zaak: ZaakDetails;
}>();

const noteInputValue = ref<string>("");

const submit = async () => {
  toast({ text: "De notitie is opgeslagen." });
  toast({
    type: "error",
    text: "Oeps het lukt niet om deze notitie op te slaan. Probeer het later opnieuw.",
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

  button {
    float: right;
  }
}
</style>
