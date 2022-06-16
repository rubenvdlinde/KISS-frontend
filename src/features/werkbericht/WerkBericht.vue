<template>
  <article>
    <header>
      <small v-if="showType && bericht.types.length">
        {{ bericht.types.join(", ") }}
      </small>
      <utrecht-heading model-value :level="level">{{
        bericht.title
      }}</utrecht-heading>
      <time :datetime="bericht.date.toISOString()" pubdate>{{
        localeString(bericht.date)
      }}</time>
      <small
        v-for="(skill, i) in bericht.skills"
        :class="`category-${skill.split(' ').join('-')}`"
        :key="i"
      >
        {{ skill }}
      </small>
    </header>
    <utrecht-document model-value class="correct-header">
      <div v-html="sanitized" />
    </utrecht-document>
  </article>
</template>

<script lang="ts" setup>
import { computed, type PropType } from "vue";
import type { Werkbericht } from "./types";
import {
  UtrechtHeading,
  UtrechtDocument,
} from "@utrecht/web-component-library-vue";
import { cleanHtml } from "@/helpers/html";

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
  showType: {
    type: Boolean,
    default: false,
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

const sanitized = computed(() => cleanHtml(props.bericht.content, props.level));
</script>

<style lang="scss" scoped>
article {
  border-radius: 1rem;
  background-color: var(--color-secondary);
  padding: 0.75rem var(--text-margin);
  max-width: var(--section-width);
  display: grid;
  gap: 0.75rem;

  header {
    display: grid;
    justify-items: flex-start;
    gap: 0.5rem;
  }

  time {
    color: var(--color-primary);
    display: block;
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
