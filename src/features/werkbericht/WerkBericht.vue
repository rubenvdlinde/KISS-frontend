<template>
  <article :class="read && 'read'">
    <small v-if="showType && bericht.types.length">
      {{ bericht.types.join(", ") }}
    </small>

    <div class="heading-container">
      <utrecht-heading model-value :level="level">
        <span class="title">{{ bericht.title }}</span>
      </utrecht-heading>

      <button
        @click="toggleRead"
        :title="`Markeer als ${read ? 'ongelezen' : 'gelezen'}`"
        class="toggle-read icon-after book"
        :disabled="toggleReadIsLoading"
      />
    </div>

    <time :datetime="bericht.date.toISOString()">{{
      localeString(bericht.date)
    }}</time>

    <div class="skills-container">
      <small
        v-for="(skill, i) in bericht.skills"
        :class="`category-${skill.split(' ').join('-')}`"
        :key="i"
      >
        {{ skill }}
      </small>
    </div>

    <utrecht-document model-value class="correct-header">
      <div v-html="sanitized" />
    </utrecht-document>
  </article>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type PropType } from "vue";
import type { Werkbericht } from "./types";
import {
  UtrechtHeading,
  UtrechtDocument,
} from "@utrecht/web-component-library-vue";
import { readBericht, unreadBericht } from "./service";
import { sanitizeHtmlToBerichtFormat, increaseHeadings } from "@/helpers/html";
import { toast } from "@/stores/toast";

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

const read = ref<boolean>(props.bericht.read);
watch(
  () => props.bericht.read,
  (newValue) => {
    read.value = newValue;
  }
);

const toggleReadIsLoading = ref<boolean>(false);

const toggleRead = async (): Promise<void> => {
  let toggleReadError = false;
  toggleReadIsLoading.value = true;

  if (read.value) {
    await unreadBericht(props.bericht.id).catch(() => (toggleReadError = true));
  }

  if (!read.value) {
    await readBericht(props.bericht.id).catch(() => (toggleReadError = true));
  }

  toggleReadIsLoading.value = false;

  if (!toggleReadError) {
    read.value = !read.value;
  }

  if (toggleReadError) {
    toast({
      text: "Oeps het lukt niet om dit bericht te markeren. Probeer het later opnieuw.",
      type: "error",
    });
  }
};

const localeString = (d: Date) =>
  d.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function processHtml(html: string) {
  const cleanedHtml = sanitizeHtmlToBerichtFormat(html);
  const increasedHeadings = increaseHeadings(cleanedHtml, props.level);
  return increasedHeadings;
}

const sanitized = computed(() => processHtml(props.bericht.content));
</script>

<style lang="scss" scoped>
article {
  border-radius: var(--radius-medium);
  background-color: var(--color-secondary);
  padding: 0.75rem var(--text-margin);
  width: 100%;
  overflow: hidden;
  display: grid;
  gap: 0.75rem;

  time {
    color: var(--color-primary);
    display: block;
  }

  .heading-container {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .toggle-read {
      all: unset;
      color: var(--color-headings);

      &:hover {
        color: var(--color-tertiary);
        cursor: pointer;
      }
      &:hover:disabled {
        cursor: wait;
      }
    }
  }

  .skills-container {
    & > small {
      font-size: 0.875rem;
    }

    & > *:not(:last-child) {
      margin-inline-end: var(--spacing-small);
    }
  }

  :deep(ul) {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    list-style-type: disc;
    padding-left: var(--text-margin);
    line-height: var(--line-height-default);
  }

  :deep(p) {
    &:not(:first-child) {
      margin-top: 1em;
    }

    &:not(:last-child) {
      margin-bottom: 1em;
    }
  }

  &.read {
    .title {
      font-weight: normal;
    }

    .toggle-read {
      color: var(--color-tertiary);
    }

    & > *:not(.heading-container) {
      display: none;
    }
  }
}
</style>
