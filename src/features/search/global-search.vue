<template>
  <form
    action="/search"
    method="get"
    enctype="application/x-www-form-urlencoded"
    @submit.prevent="submit"
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
  <template v-if="currentSearch">
    <nav>
      <ul>
        <li v-for="{ id, title, source } in searchResults" :key="'nav_' + id">
          <a :href="`#${id}`">{{ source }} - {{ title }}</a>
        </li>
      </ul>
    </nav>
    <ul>
      <li
        v-for="{ id, title, source, content } in searchResults"
        :key="'article_' + id"
      >
        <article :id="'article_' + id">
          <header>
            <h1>{{ title }}</h1>
            <small>{{ source }}</small>
          </header>
          <section v-if="content" v-html="content"></section>
        </article>
      </li>
    </ul>
  </template>
</template>

<script lang="ts" setup>
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { computed } from "vue";
import { useRouter } from "vue-router";
const queryParamName = "globalSearch";
const router = useRouter();
const currentSearch = computed(
  () => router.currentRoute.value.query?.[queryParamName]
);
function submit({ currentTarget }: Event) {
  if (currentTarget instanceof HTMLFormElement) {
    const formData = new FormData(currentTarget);
    const query = Object.fromEntries(formData) as Record<string, string>;
    router.push({
      query,
    });
  }
}
type SearchResults = {
  id: string;
  title: string;
  source: string;
  content: string;
};
const searchResults: SearchResults[] = [
  {
    id: "1234",
    title: "Hoe vraag ik toeslag aan",
    source: "Kennisbank",
    content: "",
  },
];
</script>

<style lang="scss" scoped>
form {
  min-height: var(--header-height);
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
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
button {
  background: white;
  border: none;
  padding-inline-end: var(--spacing-default);
}
input {
  padding: 0.5rem;
  padding-inline-start: var(--spacing-default);
  width: 100%;
  border: none;
}

ul {
  --container-padding: max(
    var(--spacing-default),
    calc(50vw - var(--container-width) / 2)
  );
  padding-inline: var(--container-padding);
  background-color: var(--color-secondary);
}
</style>
