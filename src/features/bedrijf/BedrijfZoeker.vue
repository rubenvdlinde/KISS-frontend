<template>
  <section>
    <fieldset>
      <div v-for="{ label, key } in searchCategories" :key="key">
        <input
          type="radio"
          name="search-category"
          :id="key"
          :value="key"
          v-model="currentSearchCategory"
        />

        <label :for="key">{{ label }}</label>
      </div>
    </fieldset>

    <form class="search-bar" @submit.prevent="handleSearch">
      <label>
        <span>Klanten zoeken</span>

        <input
          type="search"
          :placeholder="
            currentSearchCategory === 'postcodeHuisnummer'
              ? '1234AB 56'
              : 'Zoek naar een bedrijf'
          "
          v-model="currentSearchQuery"
          @search="handleSearch"
        />
      </label>

      <button title="Zoeken">
        <span>Zoeken</span><utrecht-icon-loupe model-value />
      </button>
    </form>

    <section class="resultaten-container">
      <div class="resultaten-heading-container">
        <utrecht-heading class="resultaten-heading" :level="2" model-value
          >Zoekresultaten</utrecht-heading
        >

        <div class="resultaten-found">0 resultaten gevonden</div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import {
  UtrechtIconLoupe,
  UtrechtHeading,
} from "@utrecht/web-component-library-vue";
import { ref } from "vue";
import { useBedrijfService } from "./service";
import type { SearchCategory } from "./types";

const bedrijfService = useBedrijfService();

const searchCategories: { label: string; key: SearchCategory }[] = [
  { label: "Bedrijfsnaam", key: "handelsnaam" },
  { label: "KVK-nummer ", key: "kvkNummer" },
  { label: "Postcode + Huisnummer", key: "postcodeHuisnummer" },
  { label: "E-mailadres", key: "emailadres" },
  { label: "Telefoonnummer", key: "telefoonnummer" },
];

const currentSearchCategory = ref<SearchCategory>(searchCategories[0].key);
const currentSearchQuery = ref<string>("");

const handleSearch = () => {
  bedrijfService.findBedrijf(
    currentSearchQuery.value,
    currentSearchCategory.value
  );
};
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-default);
}

fieldset {
  display: flex;
  flex-wrap: wrap;
  max-width: 600px;
  column-gap: var(--spacing-large);
  row-gap: var(--spacing-default);

  div {
    white-space: nowrap;
    display: flex;
    gap: var(--spacing-extrasmall);

    input[type="button"] {
      margin: 0;
    }
  }
}
.search-bar {
  margin-bottom: var(--spacing-large);
  width: min(100%, 20rem);
}

.resultaten-container {
  margin-block-start: var(--spacing-large);

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
  .resultaten-heading {
    padding-block-end: var(--spacing-default);
    border-bottom: 1px solid var(--color-tertiary);
  }
  .resultaten-found {
    color: var(--color-primary);
    padding-block-start: var(--spacing-small);
  }
}
</style>
