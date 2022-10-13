<template>
  <klant-aanmaken
    v-if="showKlantAanmaken"
    :handle-cancel="handleCancelKlantAanmaken"
  />

  <nav v-else>
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

    <button
      @click="toggleKlantAanmaken"
      type="button"
      class="klant-aanmaken icon-before plus utrecht-button utrecht-button--secondary-action"
    >
      <span>Klant aanmaken</span>
    </button>
  </nav>

  <section
    v-if="store.searchQuery && !showKlantAanmaken"
    class="search-section"
  >
    <simple-spinner v-if="klanten.loading" />
    <template v-if="klanten.success">
      <klanten-overzicht :klanten="klanten.data.page">
        <template #caption>
          <SearchResultsCaption :results="klanten.data" />
        </template>
      </klanten-overzicht>
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
import { useKlanten } from "./service";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue"; //todo: spinner via slot?
import Pagination from "@/nl-design-system/components/Pagination.vue"; //todo: ook via slot?
import { computed } from "@vue/reactivity";
import KlantAanmaken from "./KlantAanmaken.vue";
import { ensureState } from "@/stores/create-store"; //todo: niet in de stores map. die is applicatie specifiek. dit is generieke functionaliteit
import { useRouter } from "vue-router";
import SearchResultsCaption from "../../components/SearchResultsCaption.vue";

const store = ensureState({
  stateId: "klant-zoeker",
  stateFactory() {
    return {
      currentSearch: "",
      searchQuery: "",
      page: 1,
    };
  },
});

const router = useRouter();

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

const singleKlantId = computed(() =>
  klanten.success && klanten.data.page.length === 1
    ? klanten.data.page[0].id
    : undefined
);

watch(singleKlantId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    router.push(`/klanten/${newId}`);
  }
});

const handleSearch = () => {
  store.value.searchQuery = store.value.currentSearch;
  store.value.page = 1;
};
</script>

<style lang="scss" scoped>
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .klant-aanmaken {
    display: flex;

    span {
      margin-inline-start: var(--spacing-extrasmall);
    }
  }
}

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
