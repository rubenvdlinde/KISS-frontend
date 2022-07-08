<template>
  <form
    method="get"
    enctype="application/x-www-form-urlencoded"
    @submit.prevent="applySearch"
  >
    <section class="search-bar">
      <label
        ><input
          type="search"
          v-model="searchInput"
          placeholder="Zoeken"
          @search.prevent="applySearch"
        />Zoekterm</label
      >
      <button><span>Zoeken</span><utrecht-icon-loupe model-value /></button>
    </section>
  </form>
  <template v-if="currentSearch">
    <template v-if="searchResults.state === 'success'">
      <section
        ref="searchResultsRef"
        :class="['search-results', { isExpanded }]"
      >
        <nav v-show="!currentId">
          <ul>
            <li
              v-for="{ id, title, source } in searchResults.data.page"
              :key="'nav_' + id"
            >
              <a
                href="#"
                @click="currentId = id"
                class="icon-after chevron-down"
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
          v-show="!currentId"
        />
        <ul>
          <li
            v-for="{ id, title, source, content, url } in searchResults.data
              .page"
            :key="'searchResult_' + id"
            v-show="id === currentId"
          >
            <a class="back-to-results" href="#" @click="currentId = ''"
              >Alle zoekresultaten</a
            >
            <article>
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
              <slot name="articleFooter"></slot>
            </article>
          </li>
        </ul>
      </section>
      <button
        type="button"
        :class="['icon-after', 'chevron-down', 'expand-button', { isExpanded }]"
        @click="isExpanded = !isExpanded"
      >
        {{ buttonText }}
      </button>
    </template>
    <simple-spinner v-if="searchResults.state === 'loading'" />
  </template>
</template>

<script lang="ts" setup>
import {
  UtrechtIconLoupe,
  UtrechtHeading,
} from "@utrecht/web-component-library-vue";
import { computed, ref } from "vue";
import { useGlobalSearch } from "./service";

import Pagination from "../../nl-design-system/components/Pagination.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const searchInput = ref("");
const currentSearch = ref("");
const currentId = ref("");
const isExpanded = ref(true);
const currentPage = ref(1);
const searchResultsRef = ref<Element>();

const searchParameters = computed(() => ({
  search: currentSearch.value,
  page: currentPage.value,
}));

const searchResults = useGlobalSearch(searchParameters);

function applySearch() {
  currentSearch.value = searchInput.value;
  currentId.value = "";
  currentPage.value = 1;
}

function handlePaginationNavigation(page: number) {
  currentPage.value = page;
  const el = searchResultsRef.value;
  if (el) {
    el.scrollIntoView();
  }
}

const buttonText = computed(() =>
  isExpanded.value ? "Inklappen" : "Uitklappen"
);
</script>

<style lang="scss" scoped>
form {
  min-height: var(--header-height);
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  padding-inline: var(--spacing-default);
}

form > section {
  width: 40rem;
}

button {
  font-size: 0;
}

input,
label {
  width: 100%;
}

.search-results {
  --search-results-width: calc(var(--container-width) * 0.75);
  --container-padding: max(
    var(--spacing-default),
    calc(50vw - var(--search-results-width) / 2)
  );
  display: grid;
  padding-inline: var(--container-padding);
  padding-block-end: 1rem;
  background-color: var(--color-secondary);
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

.expand-button {
  width: 100%;
  height: fit-content;
  padding-block: 0.25rem;
  border: none;
  white-space: nowrap;
  display: flex;
  justify-content: center;

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
    gap: 0.5rem;
    justify-items: start;
    padding-block: 0.5rem;
    padding-inline-end: 1rem;

    &:after {
      transform: rotate(-90deg);
    }
  }

  li {
    padding-block: 0.5rem;
    &:not(:last-child) {
      border-bottom: 1px solid var(--color-tertiary);
    }
  }
}

.back-to-results::before {
  content: "< ";
}

article {
  display: grid;
  gap: 0.5rem;

  header {
    display: grid;
    justify-items: start;
    gap: 0.5rem;
  }

  :deep(p) {
    &:not(:first-child) {
      margin-top: 1em;
    }

    &:not(:last-child) {
      margin-bottom: 1em;
    }
  }
}

.pagination {
  margin-inline: auto;
}
</style>
