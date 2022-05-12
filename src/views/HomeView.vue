<template>
  <h1>Startscherm</h1>
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

<script setup lang="ts">
import WerkBericht from "@/components/WerkBericht.vue";
import { useLatestNews } from "@/services/news-service";
import { useLatestWorkInstructions } from "@/services/work-instructions-service";

const { data: werkInstructies } = useLatestWorkInstructions();
const { data: nieuwsBerichten } = useLatestNews();
</script>

<style scoped lang="scss">
main > section {
  max-width: var(--section-width);

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
