<template>
  <utrecht-heading :level="1">Startscherm</utrecht-heading>
  <form enctype="application/x-www-form-urlencoded" method="get">
    <section>
      <label for="werkberichtTypeInput">
        Naar welk type bericht ben je op zoek?
        <select name="type" id="werkberichtTypeInput">
          <option value="">Alle</option>
          <option value="Werkinstructies">Werkinstructies</option>
          <option value="Nieuws">Nieuws</option>
        </select>
      </label>
      <label for="searchInput"
        ><span>Zoek een werkinstructie of nieuwsbericht</span>
        <input
          type="text"
          name="search"
          id="searchInput"
          placeholder="Zoek een werkinstructie of nieuwsbericht"
      /></label>
      <button><span>Zoeken</span><utrecht-icon-loupe /></button>
    </section>
  </form>
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

<script setup lang="ts">
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import {
  useLatestNews,
  useLatestWorkInstructions,
  WerkBericht,
} from "@/features/werkbericht";
import {
  UtrechtHeading,
  UtrechtIconLoupe,
} from "@utrecht/web-component-library-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const werkinstructies = useLatestWorkInstructions();
const nieuwsberichten = useLatestNews();

function submitSearch(e: Event) {
  if (e.currentTarget instanceof HTMLFormElement) {
    const formData = new FormData(e.currentTarget);
    const entries = Array.from(formData.entries()).map(([k, v]) => [
      k,
      v.toString(),
    ]);
    const urlParams = new URLSearchParams(entries);
    router.push(router.currentRoute.value.path + "?" + urlParams.toString());
  }
}
</script>

<style scoped lang="scss">
main > section {
  &:not(:only-of-type) {
    max-width: var(--section-width);
  }

  > utrecht-heading:first-child {
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

main > section > p {
  margin-left: var(--text-margin);
  margin-bottom: var(--spacing-default);
  color: var(--color-primary);
}

form > section {
  display: inline-flex;
}

label[for="werkberichtTypeInput"],
label[for="searchInput"] {
  font-size: 0;
  display: flex;
}

input,
select {
  border-radius: 0;
  border-width: 1px;
  padding: 0.5rem;
}

#werkberichtTypeInput {
  border-radius: 1.5rem 0 0 1.5rem;
  background-color: #e8e4dc;
}

#searchInput {
  min-width: 40ch;
  max-width: 100%;
  border-right: 0;
  padding-left: 1rem;
}

button {
  --utrecht-icon-size: 1rem;

  border-radius: 0 1.5rem 1.5rem 0;
  border-left: none;
  border-width: 1px;
  background: none;
  font-size: 0;
  padding-right: 1rem;
}
</style>
