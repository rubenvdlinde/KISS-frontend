<template>
  <heading :level="1">Startscherm</heading>
  <section>
    <heading :level="2">Werkinstructies</heading>
    <paragraph v-if="werkinstructies.state === 'error'">
      {{ werkinstructies.error }}
    </paragraph>
    <template v-else-if="werkinstructies.state === 'success'">
      <ul v-if="werkinstructies.data.length">
        <li
          v-for="(werkInstructie, i) in werkinstructies.data"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht :bericht="werkInstructie" />
        </li>
      </ul>
      <paragraph v-else>Er zijn momenteel geen werkinstructies.</paragraph>
    </template>
    <paragraph v-else>Loading</paragraph>
  </section>
  <section>
    <heading :level="2">Nieuws</heading>
    <paragraph v-if="nieuwsberichten.state === 'error'">
      {{ nieuwsberichten.error }}
    </paragraph>
    <template v-else-if="nieuwsberichten.state === 'success'">
      <ul v-if="nieuwsberichten.data.length">
        <li
          v-for="(nieuwsbericht, i) in nieuwsberichten.data"
          :key="`nieuwsBerichten_${i}`"
        >
          <werk-bericht :bericht="nieuwsbericht" />
        </li>
      </ul>
      <paragraph v-else>Er zijn momenteel geen nieuwsberichten.</paragraph>
    </template>
    <paragraph v-else>Loading</paragraph>   
  </section>
   <contactmoment-starter/>
</template>

<script setup lang="ts">
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import {
  useLatestNews,
  useLatestWorkInstructions,
  WerkBericht,
} from "@/features/werkbericht";
import Heading from "@/nl-design-system/components/Heading.vue";
import { Component } from "@utrecht/web-component-library-stencil/dist/types/stencil-public-runtime";
import ContactmomentStarter from "@/features/contactmoment/ContactmomentStarter.vue"
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
