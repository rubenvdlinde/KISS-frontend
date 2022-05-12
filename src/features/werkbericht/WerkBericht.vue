<template>
  <article>
    <header>
      <component :is="`h${level}`">{{ bericht.title }}</component>
      <time :datetime="bericht.date.toISOString()" pubdate>{{
        localeString(bericht.date)
      }}</time>
    </header>
    <section v-html="bericht.content" />
  </article>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { Werkbericht } from "./types";

defineProps({
  bericht: {
    type: Object as PropType<Werkbericht>,
    required: true,
  },
  level: {
    type: Number as PropType<number>,
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
</script>

<style lang="scss" scoped>
article {
  border-radius: 1rem;
  background-color: var(--color-secondary);
  padding: 0.75rem var(--text-margin);
  max-width: var(--section-width);

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
