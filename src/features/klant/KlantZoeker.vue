<template>
  <klant-aanmaken
    v-if="showKlantAanmaken"
    :handle-cancel="handleCancelKlantAanmaken"
  />

  <section v-else class="actions">
    <form @submit.prevent="handleSearch">
      <fieldset class="radio-group">
        <legend>Waar wil je op zoeken?</legend>
        <label v-for="(item, value) in searchFields" :key="value">
          <input
            type="radio"
            :value="value"
            v-model="store.searchField"
            required
          />
          {{ item.label }}
        </label>
      </fieldset>
      <fieldset class="search-bar">
        <label>
          <span>Zoek naar een persoon</span>
          <input
            type="search"
            placeholder="Zoek naar een persoon"
            ref="inputRef"
            v-model="store.currentSearch"
            @search="handleSearch"
            title="0612345789 test@conduction.nl"
          />
        </label>
        <button title="Zoeken">
          <span>Zoeken</span><utrecht-icon-loupe model-value />
        </button>
      </fieldset>
    </form>

    <button
      @click="toggleKlantAanmaken"
      type="button"
      class="klant-aanmaken icon-before plus utrecht-button utrecht-button--secondary-action"
    >
      <span>Klant aanmaken</span>
    </button>
  </section>

  <section
    v-if="store.searchQuery?.valid && !showKlantAanmaken"
    class="search-section"
  >
    <simple-spinner v-if="klanten.loading" />
    <template v-if="klanten.success">
      <klanten-overzicht
        :klanten="klanten.data.page"
        @klant-selected="emitKlantSelected"
      />
      <pagination
        class="pagination"
        :pagination="klanten.data"
        @navigate="navigate"
      />
    </template>
    <application-message
      v-if="klanten.error"
      messageType="error"
      message="Er is een fout opgetreden"
    />
  </section>
</template>

<script lang="ts" setup>
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { watch, ref } from "vue";
import { searchFields, useKlanten, type ValidatedSearch } from "./service";
import type { Klant } from "./types";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue"; //todo: spinner via slot?
import Pagination from "@/nl-design-system/components/Pagination.vue"; //todo: ook via slot?
import { KLANT_SELECTED } from "./config";
import { computed } from "@vue/reactivity";
import KlantAanmaken from "./KlantAanmaken.vue";
import { ensureState } from "@/stores/create-store"; //todo: niet in de stores map. die is applicatie specifiek. dit is generieke functionaliteit

const store = ensureState({
  stateId: "klant-zoeker",
  stateFactory() {
    return {
      currentSearch: "",
      searchField: "",
      searchQuery: undefined as ValidatedSearch | undefined,
      page: 1,
    };
  },
});

const currentQuery = computed(() => {
  const { currentSearch, searchField } = store.value;
  if (!currentSearch || !searchField) return undefined;
  return searchFields[searchField].validate(currentSearch);
});

const inputRef = ref();

watch(
  [currentQuery, inputRef],
  ([query, input]) => {
    if (!(input instanceof HTMLInputElement)) return;
    input.setCustomValidity(!query || query.valid ? "" : query.error);
  },
  { immediate: true }
);

const klanten = useKlanten({
  search: computed(() => store.value.searchQuery),
  page: computed(() => store.value.page),
});

const navigate = (val: number) => {
  store.value.page = val;
};

const showKlantAanmaken = ref(false);
const toggleKlantAanmaken = (): void => {
  showKlantAanmaken.value = !showKlantAanmaken.value;
};
const handleCancelKlantAanmaken = () => {
  showKlantAanmaken.value = false;
};

const emit = defineEmits([KLANT_SELECTED]);
const emitKlantSelected = (klant: Klant) => {
  emit(KLANT_SELECTED, klant);
};

const singleKlant = computed(() =>
  klanten.success && klanten.data.page.length === 1
    ? klanten.data.page[0]
    : undefined
);

watch(singleKlant, (n, o) => {
  if (n && n.id !== o?.id) {
    emitKlantSelected(n);
  }
});

const handleSearch = () => {
  store.value.searchQuery = currentQuery.value;
  store.value.page = 1;
};
</script>

<style lang="scss" scoped>
.klant-aanmaken {
  display: flex;

  span {
    margin-inline-start: var(--spacing-extrasmall);
  }
}

input[type="search"] {
  width: var(--section-width);
}
.search-bar {
  margin-bottom: var(--spacing-large);
  width: min(100%, 20rem);
}

.pagination {
  margin-inline: auto;
}

.search-section {
  display: grid;
  gap: var(--spacing-small);
}

input[type="radio"] {
  accent-color: var(--color-primary);
  margin: 0;
}

.radio-group {
  display: grid;
  grid-template-columns: repeat(3, auto);
  justify-content: flex-start;
  column-gap: var(--spacing-default);
  row-gap: var(--spacing-extrasmall);

  > legend {
    font-size: 0;
  }

  label {
    display: flex;
    gap: var(--spacing-small);
    align-items: center;
  }
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}
</style>
