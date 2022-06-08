<template>
  <article>
    <header>
      <utrecht-heading :level="level">{{ bericht.title }}</utrecht-heading>
      <time :datetime="bericht.date.toISOString()" pubdate>{{
        localeString(bericht.date)
      }}</time>
    </header>
    <utrecht-document class="correct-header">
      <div v-html="sanitized" />
    </utrecht-document>
  </article>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Werkbericht } from "./types";
import DOMPurify from "dompurify";
import {
  UtrechtHeading,
  UtrechtDocument,
} from "@utrecht/web-component-library-vue";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const props = defineProps({
  bericht: {
    type: Object as PropType<Werkbericht>,
    required: true,
  },
  level: {
    type: Number as PropType<HeadingLevel>,
    default: 3,
    validator: (val) => typeof val === "number" && val >= 1 && val <= 6,
  },
});

const localeString = (d: Date) =>
  d.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const headerRegex = /(<\/?h)([1-6])(>)/g;
const increaseHeadings = (s: string, level: HeadingLevel) =>
  s.replace(headerRegex, (_, open, l, close) => {
    const newLevel = Number.parseInt(l, 10) + level - 1;
    const classes = open.includes("/")
      ? ""
      : ` class="utrecht-heading-${newLevel}"`;
    return `${open}${newLevel}${classes}${close}`;
  });

const sanitized = computed(() => {
  const safeString = DOMPurify.sanitize(props.bericht.content);
  return increaseHeadings(safeString, props.level);
});
</script>

<style lang="scss" scoped>
article {
  border-radius: 1rem;
  background-color: var(--color-secondary);
  padding: 0.75rem var(--text-margin);
  // max-width: var(--section-width);

  time {
    color: var(--color-primary);
    display: block;
    margin-top: var(--spacing-default);
    margin-bottom: 1.25rem;
  }

  :deep(ul) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    list-style-type: disc;
    padding-left: var(--text-margin);
    line-height: 1.5rem;
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
