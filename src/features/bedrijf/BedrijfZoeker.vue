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
          placeholder="Zoek naar een ondernemer"
          v-model="currentSearch"
          @search="handleSearch"
        />
      </label>

      <button title="Zoeken">
        <span>Zoeken</span><utrecht-icon-loupe model-value />
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { ref } from "vue";

const searchCategories = [
  { label: "Bedrijfsnaam", key: "bedrijfsnaam" },
  { label: "KVK-nummer ", key: "kvkNummer" },
  { label: "Postcode + Huisnummer", key: "postcodeHuisnummer" },
  { label: "E-mailadres", key: "eMailadres" },
  { label: "Telefoonnummer", key: "telefoonnummer" },
];

const currentSearchCategory = ref<string>(searchCategories[0].key);
const currentSearch = ref<string>("");

const handleSearch = () => {
  console.log("search");
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
</style>
