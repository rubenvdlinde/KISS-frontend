<template>
  <form class="search-bar" @submit.prevent="handleSearch">
    <label>
      <span>Klanten zoeken</span>
      <input
        type="search"
        placeholder="Zoek op e-mailadres of telefoonnummer"
        v-model="store.currentSearch"
        @search="handleSearch"
        title="0612345789 test@conduction.nl"
      />
    </label>
    <button title="Zoeken">
      <span>Zoeken</span><utrecht-icon-loupe model-value />
    </button>
  </form>

  <section v-if="store.searchQuery" class="search-section">
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
import { watch } from "vue";
import { useKlanten } from "./service";
import type { Klant } from "@/stores/contactmoment"; //todo alleen eigen types gebruiken, geen afhankelijkheid op gloable stores
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue"; //todo: spinner via slot?
import Pagination from "@/nl-design-system/components/Pagination.vue"; //todo: ook via slot?
import { KLANT_SELECTED } from "./config";
import { computed } from "@vue/reactivity";
import { getStore } from "@/stores/create-store"; //todo: niet in de stores map. die is applicatie specifiek. dit is generieke functionaliteit

const store = getStore({
  storeId: "klant-zoeker",
  stateFactory() {
    return {
      currentSearch: "",
      searchQuery: "",
      page: 1,
    };
  },
});

const klanten = useKlanten({
  search: computed(() => store.value.currentSearch),
  page: computed(() => store.value.page),
});

const navigate = (val: number) => {
  store.value.page = val;
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
  store.value.searchQuery = store.value.currentSearch;
  store.value.page = 1;
};
</script>

<style lang="scss" scoped>
input {
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
</style>
