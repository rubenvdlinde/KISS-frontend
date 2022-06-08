<template>
  <form
    method="get"
    enctype="application/x-www-form-urlencoded"
    ref="globalSearchForm"
  >
    <section>
      <label
        ><input
          type="search"
          :name="queryParamName"
          placeholder="Zoeken"
        />Zoekterm</label
      >
      <button><span>Zoeken</span><utrecht-icon-loupe /></button>
    </section>
  </form>
  <template v-if="currentSearch && searchResults.state === 'success'">
    <section :class="['search-results', { isExpanded }]">
      <nav v-show="!isViewingArticle">
        <ul>
          <li
            v-for="{ id, title, source } in searchResults.data"
            :key="'nav_' + id"
          >
            <a :href="`#${searchResultPrefix}${id}`"
              ><span :class="`category-${source}`">{{ source }}</span
              ><span>{{ title }}</span></a
            >
          </li>
        </ul>
      </nav>
      <ul>
        <li
          v-for="{ id, title, source, content } in searchResults.data"
          :key="searchResultPrefix + id"
          :id="searchResultPrefix + id"
        >
          <a class="back-to-results" href="#">Alle zoekresultaten</a>
          <article>
            <header>
              <utrecht-heading :level="2">{{ title }}</utrecht-heading>
              <small :class="`category-${source}`">{{ source }}</small>
            </header>
            <section v-if="content" v-html="cleanHtml(content, 2)"></section>
          </article>
        </li>
      </ul>
    </section>
    <button
      type="button"
      :class="{ isExpanded }"
      @click="isExpanded = !isExpanded"
    >
      {{ buttonText }}
    </button>
  </template>
</template>

<script lang="ts" setup>
import { bindQueryForm } from "@/helpers/forms";
import { cleanHtml } from "@/helpers/html";
import {
  UtrechtIconLoupe,
  UtrechtHeading,
} from "@utrecht/web-component-library-vue";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useGlobalSearch } from "./service";
const queryParamName = "globalSearch";
const searchResultPrefix = "global-search-result-";
const router = useRouter();
const currentSearch = computed(() =>
  router.currentRoute.value.query?.[queryParamName]?.toString()
);

const globalSearchForm = ref();
bindQueryForm(globalSearchForm);

const searchResults = useGlobalSearch(currentSearch);

const isViewingArticle = computed(() => {
  if (searchResults.state !== "success") return false;
  const { hash } = router.currentRoute.value;
  const link = hash && hash.split("#")[1];
  const id = link && link.split(searchResultPrefix)[1];
  return !!id && searchResults.data.some((x) => x.id === id);
});

const isExpanded = ref(true);
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
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: stretch;
  justify-content: center;
  border-radius: 1.5rem;
  overflow: hidden;
  width: min(40rem, 100%);
  --utrecht-icon-size: 1rem;
}
label,
button {
  font-size: 0;
}
button:not([type="button"]) {
  background: white;
  border: none;
  padding-inline-end: var(--spacing-default);
}
input {
  padding: 0.5rem;
  padding-inline-start: var(--spacing-default);
  width: 100%;
  border: none;
  &::placeholder {
    color: black;
  }
}

.search-results {
  --search-results-width: calc(var(--container-width) * 0.75);
  --container-padding: max(
    var(--spacing-default),
    calc(50vw - var(--search-results-width) / 2)
  );
  display: grid;
  padding-inline: var(--container-padding);
  background-color: var(--color-secondary);
  overflow-y: hidden;
  position: relative;

  > ul li {
    padding-block: 2rem;
    display: grid;
    gap: 1rem;

    &:not(:target) {
      display: none;
    }
  }

  &:not(.isExpanded) {
    max-height: 2.5rem;
    > * {
      opacity: 50%;
    }
  }
}

button[type="button"] {
  width: 100%;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  white-space: nowrap;
  &::after {
    display: block;
    content: "";
    width: 1rem;
    height: 0.5rem;
    background-color: currentColor;
    mask-image: url("@/assets/icons/chevron-down.svg");
    mask-repeat: no-repeat;
    display: block;
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
    gap: 0.5rem;
    align-items: center;
    justify-items: start;
    padding-block: 0.5rem;
    padding-inline-end: 1rem;

    &:after {
      content: "";
      display: block;
      height: 0.5rem;
      width: 1rem;
      background-color: currentColor;
      mask-image: url("@/assets/icons/chevron-down.svg");
      mask-repeat: no-repeat;
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
</style>
