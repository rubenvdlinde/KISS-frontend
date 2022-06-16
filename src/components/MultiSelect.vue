<template>
  <div>
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
          />
        </label>
      </fieldset>
    </details>
  </div>
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

watch(currentValue, (v) => emit("update:modelValue", v));
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
div {
  position: relative;
  padding-block-end: 2.75rem;
  margin-block-start: -0.5rem;
  width: 100%;
}

summary {
  width: fit-content;
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: var(--radius-large);
  margin-inline-start: auto;
  font-weight: 500;
  padding-block: 0.5rem;
  padding-inline: 1.5rem;
  border: 2px var(--color-primary) solid;
  color: var(--color-primary);
  max-width: 100%;

  &:hover {
    cursor: pointer;
  }

  > * {
    display: inline;
  }
}

details {
  position: absolute;
  min-width: fit-content;
  width: 100%;
  right: 0;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-end;
  justify-content: flex-end;
  z-index: 1;
  padding-inline: 1rem;
  padding-block-end: 1rem;
  padding-block-start: 0.5rem;
  border-radius: var(--radius-medium);
}

select {
  max-width: 100%;
}

details[open] {
  background-color: var(--color-secondary);
  box-shadow: 0 0 0.2857142857em 0 rgb(0 0 0 / 20%);

  > summary {
    border-color: transparent;
    border-radius: 0;
    border-bottom-color: var(--color-primary);
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
  gap: 0.5rem;
  margin-top: 0.5rem;

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
