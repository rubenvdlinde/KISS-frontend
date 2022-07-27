<template>
  <form
    method="get"
    enctype="application/x-www-form-urlencoded"
    @submit.prevent="applySearch"
  >
    <fieldset class="bronnen" v-if="sources.success">
      <label v-for="bron in sources.data" :key="bron.name + bron.type">
        <input type="checkbox" v-model="selectedSources" :value="bron" />
        {{ bron.name }}
      </label>
    </fieldset>
    <div class="search-bar">
      <label
        ><input
          type="search"
          v-model="searchInput"
          placeholder="Zoeken"
          @search.prevent="applySearch"
        />Zoekterm</label
      >
      <button><span>Zoeken</span><utrecht-icon-loupe model-value /></button>
    </div>
  </form>
  <template v-if="currentSearch">
    <section ref="searchResultsRef" :class="['search-results', { isExpanded }]">
      <template v-if="searchResults.success">
        <p v-if="!hasResults" class="no-results">Geen resultaten gevonden</p>
        <template v-else>
          <nav v-show="!currentId">
            <ul>
              <li
                v-for="{ id, title, source, jsonObject } in searchResults.data
                  .page"
                :key="'nav_' + id"
              >
                <a
                  href="#"
                  @click="currentId = id"
                  class="icon-after chevron-down"
                  ><span :class="`category-${source}`">{{ source }}</span
                  ><span>{{ title }}</span></a
                >
                <a v-if="source === 'smoelenboek'">
                  <span></span
                  ><span
                    >{{ jsonObject?.function }}
                    {{ jsonObject?.department }}</span
                  >
                </a>
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
              v-for="{
                id,
                title,
                source,
                content,
                url,
                jsonObject,
              } in searchResults.data.page"
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
                <div v-if="jsonObject">
                  <div class="left">
                    <h2>Algemene contactgegevens</h2>
                    <p>
                      <label><strong>E-mailadres: </strong></label
                      ><span>{{ jsonObject?.user }}</span>
                    </p>
                    <p>
                      <label><strong>Telefoonnummer 1: </strong></label
                      ><span>{{ jsonObject?.contact?.telefoonnummer1 }}</span>
                    </p>
                    <h2>Agenda</h2>
                    <table class="availability">
                      <thead>
                        <tr>
                          <td></td>
                          <td
                            v-for="(_, day) in jsonObject?.calendar
                              ?.availabilities"
                            :key="day"
                          >
                            {{ day }}
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>ochtend</td>
                          <td
                            v-for="(value, day) in jsonObject?.calendar
                              ?.availabilities"
                            :key="day"
                            :class="[value.ochtend ? 'groen' : 'rood']"
                          ></td>
                        </tr>
                        <tr>
                          <td>middag</td>
                          <td
                            v-for="(value, day) in jsonObject?.calendar
                              ?.availabilities"
                            :key="day"
                            :class="[value.middag ? 'groen' : 'rood']"
                          ></td>
                        </tr>
                      </tbody>
                    </table>

                    <p>
                      <label><strong>Vervanger: </strong></label
                      ><span>{{ jsonObject?.replacement }}</span>
                    </p>
                  </div>

                  <div>
                    <img
                      v-if="jsonObject.optionalProfilePicture"
                      :src="jsonObject.optionalProfilePicture"
                      width="128"
                    />
                    <p>
                      <label><strong>Functie: </strong></label
                      ><span>{{ jsonObject?.function }}</span>
                    </p>
                    <p>
                      <label><strong>Afdeling: </strong></label
                      ><span>{{ jsonObject?.department }}</span>
                    </p>
                    <p>
                      {{ jsonObject?.skills }}
                    </p>
                  </div>
                </div>
                <p v-else-if="content">{{ content }}</p>

                <slot name="articleFooter" :id="url" :title="title"></slot>
              </article>
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
      :class="['icon-after', 'chevron-down', 'expand-button', { isExpanded }]"
      @click="isExpanded = !isExpanded"
      v-if="searchResults.success && searchResults.data.page.length"
    >
      {{ buttonText }}
    </button>
  </template>
</template>

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

const selectedSources = ref<Source[]>([]);

const searchResults = useGlobalSearch(searchParameters);
const sources = useSources();

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

const hasResults = computed(
  () => searchResults.success && !!searchResults.data.page.length
);

watch(hasResults, (x) => {
  if (!x) {
    isExpanded.value = true;
  }
});
</script>

<style lang="scss" scoped>
form {
  grid-area: bar;
  padding-block-start: var(--spacing-small);
  padding-block-end: var(--spacing-large);
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
  color: white;
  margin-inline: auto;
}

.search-results {
  --search-results-width: calc(var(--container-width) * 0.75);
  --container-padding: max(
    var(--spacing-default),
    calc(50vw - var(--search-results-width) / 2)
  );
  grid-area: results;
  display: grid;
  justify-items: stretch;
  padding-inline: var(--container-padding);
  padding-block: var(--spacing-default);
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

.no-results {
  justify-self: center;
}

.spinner {
  font-size: 2rem;
}

.expand-button {
  grid-area: expand;
  width: 100%;
  height: fit-content;
  padding-block: 0.25rem;
  border: none;
  white-space: nowrap;
  display: flex;
  justify-content: center;
  margin-block-start: calc(var(--spacing-default) * -0.5);

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

.left {
  float: left;
  margin-right: 5em;
}

table {
  border-collapse: separate;
  border-spacing: 10px;
}
table td {
  padding-right: 10px;
  margin: 10px;
}
.groen {
  background-color: green;
}
.rood {
  background-color: red;
}
</style>
