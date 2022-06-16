<template>
  <details ref="detailsEl">
    <summary class="icon-before filter">{{ label }}</summary>
    <fieldset>
      <legend>{{ label }}</legend>
      <label
        v-for="[key, name] in options"
        :for="name + '_check_' + key"
        :key="name + '_check_' + key"
      >
        {{ name }}
        <input
          type="checkbox"
          :name="name"
          :id="name + '_check_' + key"
          :value="key"
          v-model="currentValue"
          @change="emit('update:modelValue', currentValue)"
        />
      </label>
    </fieldset>
  </details>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";
import { ref, watch } from "vue";

const props = defineProps<{
  name: string;
  label: string;
  options: [number, string][];
  modelValue: number[];
}>();
const emit = defineEmits(["update:modelValue"]);
const currentValue = ref(props.modelValue);
const detailsEl = ref<HTMLElement>();

watch(
  () => props.modelValue,
  (v) => {
    currentValue.value = v;
  }
);

onClickOutside(detailsEl, () => {
  const el = detailsEl.value;
  if (!(el instanceof HTMLElement)) return;
  el.removeAttribute("open");
});
</script>

<style scoped lang="scss">
summary {
  width: fit-content;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: var(--radius-large);
  margin-inline-start: auto;
  font-weight: 500;
  padding-block: 0.5rem;
  padding-inline: var(--padding-inline);
  border: var(--border-style);
  color: var(--color-primary);
  max-width: 100%;
  user-select: none;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline-color: var(--utrecht-focus-outline-color, transparent);
    outline-offset: var(--utrecht-focus-outline-offset, 0);
    outline-style: var(--utrecht-focus-outline-style, solid);
    outline-width: var(--utrecht-focus-outline-width, 0);
  }

  > * {
    display: inline;
  }
}

details {
  --box-shadow: 0 0 0.2857142857em 0 rgb(0 0 0 / 20%);
  --border-width: 2px;
  --border-style: var(--color-primary) var(--border-width) solid;
  --padding-inline: 1.5rem;
  position: relative;
  min-width: fit-content;
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: flex-end;
  z-index: 1;
  border-start-start-radius: var(--radius-medium);
  border-start-end-radius: var(--radius-medium);
}

select {
  max-width: 100%;
}

details[open] {
  background-color: var(--color-secondary);
  box-shadow: var(--box-shadow);

  > summary {
    border-color: transparent;
    border-radius: 0;
    width: 100%;

    &::before {
      mask-image: url("@/assets/icons/chevron-down.svg");
      height: 0.5rem;
      transform: rotate(180deg);
    }
  }
}

legend {
  font-size: 0;
}

fieldset {
  display: grid;
  position: absolute;
  width: 100%;
  border-block-start: var(--border-style);
  bottom: var(--border-width);
  transform: translateY(100%);
  gap: 0.5rem;
  background-color: var(--color-secondary);
  box-shadow: var(--box-shadow);
  padding-block: 1rem;
  padding-inline: var(--padding-inline);
  border-end-end-radius: var(--radius-medium);
  border-end-start-radius: var(--radius-medium);
  clip-path: inset(0px -5px -5px -5px);

  label {
    display: flex;
    justify-content: space-between;

    &:hover {
      cursor: pointer;
    }
  }

  input {
    accent-color: var(--color-primary);
    transform: scale(1.25);
  }
}
</style>
