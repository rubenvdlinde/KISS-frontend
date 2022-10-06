<template>
  <form
    method="get"
    enctype="application/x-www-form-urlencoded"
    @submit.prevent="applySearch"
    ref="searchBarRef"
  >
    <fieldset class="bronnen" v-if="sources.success">
      <label v-for="bron in sources.data" :key="bron.name + bron.type">
        <input type="checkbox" v-model="state.selectedSources" :value="bron" />
        {{ bron.name.replace(/(^\w+:|^)\/\//, "").replace("www.", "") }}
      </label>
    </fieldset>
    <div class="search-bar">
      <label
        ><input
          type="search"
          v-model="state.searchInput"
          placeholder="Zoeken"
          @search.prevent="applySearch"
          id="global-search-input"
        />Zoekterm</label
      >
      <button><span>Zoeken</span><utrecht-icon-loupe model-value /></button>
    </div>
  </form>
  <template v-if="state.currentSearch">
    <section
      :class="['search-results', { isExpanded: state.isExpanded }]"
      :inert="!state.isExpanded"
    >
      <template v-if="searchResults.success">
        <p v-if="!hasResults" class="no-results">Geen resultaten gevonden</p>
        <template v-else>
          <nav v-show="!state.currentId">
            <ul>
              <li
                v-for="{
                  id,
                  title,
                  source,
                  jsonObject,
                  url,
                  self,
                } in searchResults.data.page"
                :key="'nav_' + id"
              >
                <a
                  v-if="!url"
                  href="#"
                  @click="
                    selectSearchResult(id, source, jsonObject, title, self)
                  "
                  class="icon-after chevron-down"
                >
                  <span :class="`category-${source}`">{{ source }}</span>
                  <span v-if="source === 'Smoelenboek'">
                    {{
                      [title, jsonObject?.function, jsonObject?.department]
                        .filter(Boolean)
                        .join(", ")
                    }}
                  </span>
                  <span v-else>{{ title }}</span>
                </a>
                <a
                  v-else
                  @click.prevent="
                    handleWebsiteSelected({ url: url.toString(), title: title })
                  "
                  :href="url.toString()"
                  class="icon-after chevron-down"
                  rel="noopener noreferrer"
                  ><span :class="`category-${source}`">{{ source }}</span
                  ><span>{{ title }}</span></a
                >
              </li>
            </ul>
          </nav>
          <pagination
            class="pagination"
            :pagination="searchResults.data"
            @navigate="handlePaginationNavigation"
            v-show="!state.currentId"
          />
          <ul v-show="!!state.currentId">
            <li
              v-for="{
                id,
                title,
                source,
                content,
                url,
                jsonObject,
              } in searchResults.data.page"
              :key="'searchResult_' + id"
              v-show="id === state.currentId"
            >
              <a class="back-to-results" href="#" @click="state.currentId = ''"
                >Alle zoekresultaten</a
              >
              <medewerker-detail
                :medewerkerRaw="jsonObject"
                v-if="source === 'Smoelenboek'"
                :title="title"
                :heading-level="2"
              />
              <kennisartikel-detail
                v-else-if="source === 'Kennisartikel'"
                :kennisartikel-raw="jsonObject"
                :title="title"
                :heading-level="2"
              />
              <article v-else>
                <header>
                  <utrecht-heading model-value :level="2"
                    ><a
                      v-if="url"
                      :href="url.toString()"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ title }}
                    </a>
                    <template v-else>{{ title }}</template>
                  </utrecht-heading>
                  <small :class="`category-${source}`">{{ source }}</small>
                </header>

                <p v-if="content">{{ content }}</p>
              </article>
              <slot name="articleFooter" :id="url" :title="title"></slot>
            </li>
          </ul>
        </template>
      </template>
      <simple-spinner
        class="spinner"
        v-if="searchResults.state === 'loading'"
      />
    </section>
    <button
      type="button"
      :class="[
        'icon-after',
        'chevron-down',
        'expand-button',
        { isExpanded: state.isExpanded },
      ]"
      @click="state.isExpanded = !state.isExpanded"
      v-if="searchResults.success && searchResults.data.page.length"
    >
      {{ buttonText }}
    </button>
  </template>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import {
  UtrechtIconLoupe,
  UtrechtHeading,
} from "@utrecht/web-component-library-vue";
import { computed, ref, watch } from "vue";
import { useGlobalSearch, useSources } from "./service";

import Pagination from "../../nl-design-system/components/Pagination.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import type { Source } from "./types";
import MedewerkerDetail from "./MedewerkerDetail.vue";
import KennisartikelDetail from "./KennisartikelDetail.vue";
import type {
  Medewerker,
  Kennisartikel,
  Website,
} from "@/features/search/types";
import { useContactmomentStore } from "@/stores/contactmoment";
import { ensureState } from "@/stores/create-store";

const emit = defineEmits<{
  (
    e: "result-selected",
    params: {
      id: string;
      title: string;
      jsonObject: any;
      source: string;
    }
  ): void;
}>();

const contactmomentStore = useContactmomentStore();

const state = ensureState({
  stateId: "GlobalSearch",
  stateFactory() {
    return {
      searchInput: "",
      currentSearch: "",
      currentId: "",
      currentPage: 1,
      isExpanded: true,
      selectedSources: [] as Source[],
    };
  },
});

const searchBarRef = ref();

const searchParameters = computed(() => ({
  search: state.value.currentSearch,
  page: state.value.currentPage,
  filters: state.value.selectedSources,
}));

const searchResults = useGlobalSearch(searchParameters);
const sources = useSources();

function applySearch() {
  state.value.currentSearch = state.value.searchInput;
  state.value.currentId = "";
  state.value.currentPage = 1;
}

function handlePaginationNavigation(page: number) {
  state.value.currentPage = page;
  const el = searchBarRef.value;
  if (el instanceof Element) {
    el.scrollIntoView();
  }
}

const buttonText = computed(() =>
  state.value.isExpanded ? "Inklappen" : "Uitklappen"
);

const hasResults = computed(
  () => searchResults.success && !!searchResults.data.page.length
);

watch(hasResults, (x) => {
  if (!x) {
    state.value.isExpanded = true;
  }
});

const selectSearchResult = (
  id: string,
  source: string,
  jsonObject: any,
  title: string,
  self: string | undefined
) => {
  state.value.currentId = id;

  if (contactmomentStore.contactmomentLoopt) {
    if (source === "Smoelenboek")
      handleSmoelenboekSelected(jsonObject, self ?? "");
    if (source === "Kennisartikel") handleKennisartikelSelected(jsonObject);
  }

  emit("result-selected", {
    id,
    title,
    source,
    jsonObject,
  });
};

const handleSmoelenboekSelected = (
  medewerker: Medewerker,
  url: string
): void => {
  contactmomentStore.addMedewerker(medewerker, url);
};

const handleKennisartikelSelected = (kennisartikel: Kennisartikel): void => {
  contactmomentStore.addKennisartikel(kennisartikel);
};

const handleWebsiteSelected = (website: Website): void => {
  contactmomentStore.addWebsite(website);
  window.open(website.url);
};
</script>

<style lang="scss" scoped>
form {
  grid-area: bar;
  padding-block-start: var(--spacing-small);
  padding-block-end: var(--spacing-default);
  display: grid;
  gap: var(--spacing-small);
}

.search-bar {
  max-width: 40rem;
  width: 100%;
}

button {
  font-size: 0;
}

input[type="checkbox"] {
  accent-color: var(--color-secondary);
}

fieldset {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-default);
  margin-inline-start: var(--spacing-large);
  color: var(--color-white);
}

.search-results {
  grid-area: results;
  display: grid;
  justify-items: stretch;
  padding-inline-start: var(--spacing-large);
  padding-inline-end: var(--container-padding);
  padding-block-end: var(--spacing-default);
  background-color: var(--color-secondary);
  gap: var(--spacing-default);
  //
  position: relative;

  > ul li {
    padding-block: 2rem;
    display: grid;
    gap: 1rem;
  }

  &:not(.isExpanded) {
    max-height: 2.5rem;
    pointer-events: none;
    user-select: none;
    overflow: hidden;
    > * {
      opacity: 50%;
    }
  }
}

.no-results {
  justify-self: center;
}

.spinner {
  font-size: 2rem;
}

.expand-button {
  grid-area: expand;
  padding-inline-end: var(--container-padding);
  padding-inline-start: var(--spacing-large);
  inline-size: 100%;
  block-size: 1rem;
  padding-block: 0.25rem;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  background: var(--color-secondary);

  &:not(.isExpanded) {
    margin-block-start: -1rem;
    background: none;
  }

  &.isExpanded::after {
    transform: rotate(180deg);
  }
}

nav ul {
  display: grid;

  a {
    color: inherit;
    text-decoration: none;
    display: grid;
    grid-template-columns: 20ch 1fr 2ch;
    gap: var(--spacing-default);
    justify-items: start;
    padding-inline-end: var(--spacing-default);

    &:after {
      transform: rotate(-90deg);
      margin-inline-start: auto;
    }
  }

  li {
    padding-block: var(--spacing-default);
    border-block-end: 1px solid var(--color-tertiary);
    display: flex;

    a:hover {
      cursor: pointer;
    }
  }
}

.back-to-results::before {
  content: "< ";
}

.pagination {
  margin-inline: auto;
}
</style>
