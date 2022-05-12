<template>
  <h1>Startscherm</h1>
  <template v-if="search">
    <router-link to="/">Terug</router-link>
    <section>
      <h2>Zoekresultaten</h2>
      <p>{{ searchResults.length || "geen" }} resultaten gevonden</p>
      <ul>
        <li v-for="(bericht, i) in searchResults" :key="`werkinstructies_${i}`">
          <werk-bericht :bericht="bericht" :type="bericht.type" />
        </li>
      </ul>
    </section>
  </template>
  <template v-else>
    <section>
      <h2>Werkinstructies</h2>
      <ul>
        <li
          v-for="(werkInstructie, i) in werkInstructies"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht :bericht="werkInstructie" />
        </li>
      </ul>
    </section>
    <section>
      <h2>Nieuws</h2>
      <ul>
        <li v-for="(nieuwsBericht, i) in nieuwsBerichten" :key="`nieuws_${i}`">
          <werk-bericht :bericht="nieuwsBericht" />
        </li>
      </ul>
    </section>
  </template>
</template>

<script setup lang="ts">
import WerkBericht from "@/components/WerkBericht.vue";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useLatestNews } from "@/services/news-service";
import { useLatestWorkInstructions } from "@/services/work-instructions-service";
import { useSearchWorkMessages } from "@/services/search-service";

const route = useRoute();
const search = computed(() => route.query.search?.toString());

const { data: werkInstructies } = useLatestWorkInstructions();
const { data: nieuwsBerichten } = useLatestNews();
const { data: searchResults } = useSearchWorkMessages(search);
</script>

<style scoped lang="scss">
main > section {
  &:not(:only-of-type) {
    max-width: var(--section-width);
  }

  h2 {
    padding-left: var(--text-margin);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-tertiary);
    margin-bottom: var(--spacing-default);
  }
}

section ul {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: 1.625rem;
}

section > p {
  margin-left: var(--text-margin);
  margin-bottom: var(--spacing-default);
  color: var(--color-primary);
}
</style>
