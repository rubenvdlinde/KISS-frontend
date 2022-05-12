<template>
  <h1>Startscherm</h1>
  <section>
    <h2>Werkinstructies</h2>
    <p v-if="werkinstructies.state === 'error'">
      {{ werkinstructies.error }}
    </p>
    <template v-else-if="werkinstructies.state === 'success'">
      <ul v-if="werkinstructies.data.length">
        <li
          v-for="(werkInstructie, i) in werkinstructies.data"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht :bericht="werkInstructie" />
        </li>
      </ul>
      <p v-else>Er zijn momenteel geen werkinstructies.</p>
    </template>
    <p v-else>Loading</p>
  </section>
  <section>
    <h2>Nieuws</h2>
    <p v-if="nieuwsberichten.state === 'error'">
      {{ nieuwsberichten.error }}
    </p>
    <template v-else-if="nieuwsberichten.state === 'success'">
      <ul v-if="nieuwsberichten.data.length">
        <li
          v-for="(nieuwsbericht, i) in nieuwsberichten.data"
          :key="`nieuwsBerichten_${i}`"
        >
          <werk-bericht :bericht="nieuwsbericht" />
        </li>
      </ul>
      <p v-else>Er zijn momenteel geen nieuwsberichten.</p>
    </template>
    <p v-else>Loading</p>
  </section>
</template>

<script setup lang="ts">
import {
  useLatestNews,
  useLatestWorkInstructions,
  WerkBericht,
} from "@/features/werkbericht";

const werkinstructies = useLatestWorkInstructions();
const nieuwsberichten = useLatestNews();
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
