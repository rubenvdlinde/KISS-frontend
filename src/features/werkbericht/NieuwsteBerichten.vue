<template>
  <section>
    <utrecht-heading :level="2">Werkinstructies</utrecht-heading>
    <paragraph v-if="werkinstructies.state === 'error'">
      Er ging iets mis bij het laden van de werkinstructies.
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
    <simple-spinner v-else></simple-spinner>
  </section>
  <section>
    <utrecht-heading :level="2">Nieuws</utrecht-heading>
    <paragraph v-if="nieuwsberichten.state === 'error'">
      Er ging iets mis bij het laden van de nieuwbserichten
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
    <simple-spinner v-else></simple-spinner>
  </section>
</template>
<script lang="ts" setup>
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import {
  useLatestNews,
  useLatestWorkInstructions,
  WerkBericht,
} from "@/features/werkbericht";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

const werkinstructies = useLatestWorkInstructions();
const nieuwsberichten = useLatestNews();
</script>
