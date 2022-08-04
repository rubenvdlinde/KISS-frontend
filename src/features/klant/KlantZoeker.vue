<template>
  <form class="search-bar" @submit.prevent="handleSearch">
    <label title="0612345789 test@conduction.nl"
      ><span>Klanten zoeken</span>
      <input
        type="search"
        placeholder="Zoek op e-mailadres of telefoonnummer"
        v-model="currentSearch"
        v-focus
        @search="handleSearch"
    /></label>
    <button title="Zoeken">
      <span>Zoeken</span><utrecht-icon-loupe model-value />
    </button>
  </form>

  <section v-if="searchQuery" class="search-section">
    <simple-spinner v-if="klanten.loading"></simple-spinner>
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
      v-if="serviceResult?.error"
      messageType="error"
      message="Er is een fout opgetreden"
    ></application-message>
  </section>
</template>

<script lang="ts" setup>
import type { ServiceData } from "@/services";
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { ref, watch } from "vue";
import { useKlanten } from "./service";
import type { Klant } from "@/stores/contactmoment";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Pagination from "@/nl-design-system/components/Pagination.vue";
import { KLANT_SELECTED } from "./config";
import { computed } from "@vue/reactivity";

const currentSearch = ref("");
const searchQuery = ref("");
const page = ref(1);
const klanten = useKlanten({ search: searchQuery, page });
const navigate = (val: number) => {
  page.value = val;
};

const serviceResult = ref<ServiceData<Klant>>();

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
  searchQuery.value = currentSearch.value;
  page.value = 1;
};
</script>

<style lang="scss" scoped>
input {
  width: var(--section-width);
}
.search-bar {
  margin-bottom: var(--spacing-large);
}

.pagination {
  margin-inline: auto;
}

.search-section {
  display: grid;
  gap: var(--spacing-small);
}
</style>
