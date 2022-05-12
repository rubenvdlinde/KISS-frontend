<template>
  <article>
    <header>
      <component :is="`h${level}`">{{ bericht.title }}</component>
      <time :datetime="bericht.date.toISOString()" pubdate>{{
        localeString(bericht.date)
      }}</time>
    </header>
    <p>
      {{ bericht.content }}
    </p>
  </article>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type WerkBericht from "@/types/werk-bericht";

defineProps({
  bericht: {
    type: Object as PropType<WerkBericht>,
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
  }

  > p {
    margin-top: 1.25rem;
  }
}
</style>
