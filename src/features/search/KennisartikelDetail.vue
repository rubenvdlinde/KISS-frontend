<template>
  <article>
    <utrecht-heading model-value :level="level" class="heading">
      {{ title }}
    </utrecht-heading>
    <nav>
      <ul>
        <li
          v-for="({ isActive, label, id }, i) in mappedSections"
          :key="id + 'nav'"
          :class="{ 'is-active': isActive }"
        >
          <span v-if="isActive">{{ label }}</span>
          <a v-else :href="`#${id}`" @click.prevent="currentSectionIndex = i">{{
            label
          }}</a>
        </li>
      </ul>
    </nav>
    <section
      v-for="{ id, html, isActive, label } in mappedSections"
      :key="id + 'text'"
      :class="{ 'is-active': isActive }"
      :id="id"
    >
      <utrecht-heading model-value :level="level + 1">{{
        label
      }}</utrecht-heading>
      <div v-html="html"></div>
    </section>
  </article>
</template>
<script setup lang="ts">
import { cleanHtml, unEscapeHtml } from "@/helpers/html";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { nanoid } from "nanoid";
import { computed, ref, watch } from "vue";

const language = "nl";
const knownSections = {
  specifiekeTekst: "Inleiding",
  procedureBeschrijving: "Aanvraag",
  conditions: "Voorwaarden",
  bewijs: "Bewijs",
  kostenEnBetaalmethoden: "Kosten",
  uitersteTermijn: "Termijn",
  bezwaarEnBeroep: "Bezwaar",
  vereisten: "Vereisten",
  notice: "Bijzonderheden",
  wtdBijGeenReactie: "Geen reactie",
  contact: "Contact",
  deskMemo: "KCC",
} as const;

const uniqueId = nanoid();

const props = defineProps<{
  jsonObject: any;
  title: string;
  level: 2 | 3 | 4;
}>();

const currentSectionIndex = ref(0);

const translation = computed(() =>
  props.jsonObject.vertalingen.find((x: any) => x.taal === language)
);

const sections = computed(() => {
  const translationObj = translation.value;
  const level = props.level;
  return Object.entries(knownSections)
    .map(([key, label], i) => {
      const text = translationObj[key];
      if (!text) return undefined;
      const unEscaped = unEscapeHtml(text);
      const cleaned = cleanHtml(unEscaped, (level + 1) as any);
      return {
        id: uniqueId + i,
        label,
        html: cleaned,
      };
    })
    .filter(Boolean) as { id: string; label: string; html: string }[];
});

const mappedSections = computed(() =>
  sections.value.map((section, i) => ({
    ...section,
    isActive: i === currentSectionIndex.value,
  }))
);

watch(
  () => props.jsonObject.uuid,
  () => {
    currentSectionIndex.value = 0;
  }
);
</script>

<style scoped lang="scss">
article {
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: var(--spacing-large);
  .heading {
    grid-column: span 2;
  }
  > section {
    grid-column: 2;
    grid-row: 2;
    display: none;

    &.is-active {
      display: block;
    }

    div :deep(h3),
    div :deep(h4) {
      margin-block-start: var(--spacing-default);
    }

    :deep(ul) {
      list-style: disc;
      margin-inline-start: var(--spacing-default);
      margin-block: var(--spacing-small);

      ul {
        list-style: circle;
        margin-block: 0;
      }
    }
  }
}

nav ul {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-extrasmall);

  li {
    border: 1px solid var(--color-tertiary);

    a,
    span {
      text-decoration: none;
      color: inherit;
      padding: var(--spacing-small);
      display: block;
    }
  }

  .is-active {
    background-color: var(--color-tertiary);
    color: white;
    text-decoration: underline;
  }
}
</style>
