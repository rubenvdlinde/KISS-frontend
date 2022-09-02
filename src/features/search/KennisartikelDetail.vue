<template>
  <article>
    <utrecht-heading model-value :level="headingLevel" class="heading">
      {{ title }}
    </utrecht-heading>
    <nav>
      <ul>
        <li
          v-for="{ isActive, label, id, setActive } in mappedSections"
          :key="id + 'nav'"
          :class="{ 'is-active': isActive }"
        >
          <span v-if="isActive">{{ label }}</span>
          <a v-else :href="`#${id}`" @click.prevent="setActive">{{ label }}</a>
        </li>
      </ul>
    </nav>
    <section
      v-for="{ id, html, isActive, label } in mappedSections"
      :key="id + 'text'"
      :class="{ 'is-active': isActive }"
      :id="id"
    >
      <utrecht-heading model-value :level="headingLevel + 1">{{
        label
      }}</utrecht-heading>
      <div v-html="html"></div>
    </section>
  </article>
</template>
<script setup lang="ts">
import {
  sanitizeHtmlToBerichtFormat,
  unescapeHtml,
  increaseHeadings,
} from "@/helpers/html";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { nanoid } from "nanoid";
import { computed, ref, watch } from "vue";

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

const componentId = nanoid();

const props = defineProps<{
  kennisartikelRaw: any;
  title: string;
  headingLevel: 2 | 3 | 4;
}>();

function processHtml(html: string) {
  const unescapedHtml = unescapeHtml(html);
  const cleanedHtml = sanitizeHtmlToBerichtFormat(unescapedHtml);
  const htmlWithIncreasedHeadings = increaseHeadings(
    cleanedHtml,
    (props.headingLevel + 1) as any
  );
  return htmlWithIncreasedHeadings;
}

const currentSectionIndex = ref(0);

const kennisartikel = computed<Record<string, string>>(() => {
  const { vertalingen } = props.kennisartikelRaw || {};
  if (!Array.isArray(vertalingen)) return {};
  return vertalingen.find(({ taal }) => taal === "nl") || {};
});

const processedSections = computed(() => {
  const allSections = Object.entries(knownSections).map(([key, label]) => ({
    label,
    text: kennisartikel.value[key],
  }));

  const sectionsWithActualText = allSections.filter(({ text }) => !!text);

  const sectionsWithProcessedHtml = sectionsWithActualText.map(
    ({ label, text }) => ({
      label,
      html: processHtml(text),
    })
  );

  return sectionsWithProcessedHtml;
});

// seperate this computed variable for caching purposes: making a section active doesn't trigger the reprocessing of the source html
const mappedSections = computed(() =>
  processedSections.value.map((section, index) => ({
    ...section,
    id: componentId + index,
    isActive: index === currentSectionIndex.value,
    setActive() {
      currentSectionIndex.value = index;
    },
  }))
);

watch(
  () => props.kennisartikelRaw.uuid,
  () => {
    currentSectionIndex.value = 0;
  }
);
</script>

<style scoped lang="scss">
article {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-large);

  .heading {
    width: 100%;
  }
  > section {
    flex: 1;
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

    :deep(td) {
      border: 1px var(--color-tertiary) solid;
      padding: var(--spacing-small);
    }

    :deep(table) {
      margin-block: var(--spacing-small);
    }

    :deep(p + p) {
      margin-block-start: var(--spacing-small);
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
    color: var(--color-white);
    text-decoration: underline;
  }
}
</style>
