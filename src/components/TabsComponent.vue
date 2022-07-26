<template>
  <section>
    <nav role="tablist">
      <component
        v-for="{
          label,
          tag,
          href,
          isActive,
          panelId,
          tabId,
          enable,
        } in entries"
        :key="tabId"
        role="tab"
        :aria-selected="isActive"
        :aria-controls="panelId"
        :href="href"
        :id="tabId"
        :is="tag"
        @click.prevent="enable"
      >
        {{ label }}
      </component>
    </nav>
    <ul>
      <li
        v-for="{ name, isActive, panelId, tabId } in entries"
        :key="panelId"
        :id="panelId"
        role="tabpanel"
        :aria-labelledby="tabId"
        v-show="isActive"
      >
        <slot :name="name"></slot>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
let counter = 0;
const getCounter = () => (counter += 1);
</script>

<script lang="ts" setup>
import { watch, computed, useSlots } from "vue";

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const slots = useSlots();
const emit = defineEmits(["update:modelValue"]);

const currentCounter = getCounter();
const slotKeys = Object.keys(slots);
const entries = computed(() =>
  slotKeys.map((name) => {
    const id = currentCounter + "_" + name;
    const isActive = props.modelValue === name;

    return {
      isActive,
      name,
      label: name,
      href: isActive ? undefined : "#" + encodeURIComponent(name),
      tag: isActive ? "span" : "a",
      tabId: id + "_tab",
      panelId: id + "_panel",
      enable() {
        emit("update:modelValue", name);
      },
    };
  })
);
watch(
  [slotKeys],
  ([s]) => {
    if (!s.length) return;
    if (!props.modelValue || !s.includes(props.modelValue)) {
      emit("update:modelValue", s[0]);
    }
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
[role="tablist"] {
  display: flex;
  font-size: var(--tab-size, 1rem);
  font-weight: bold;
  color: var(--tab-color, var(--utrecht-heading-color));
  gap: var(--tab-gap, 0.5em);
}

[role="tab"] {
  text-decoration: none;
  color: inherit;
  --tab-spacing: var(--spacing-default);
  padding: var(--tab-spacing);
  margin-inline-start: calc(-1 * var(--tab-spacing));
  border-start-end-radius: var(--radius-default);
  border-start-start-radius: var(--radius-default);
}

[role="tabpanel"],
[role="tab"][aria-selected="true"] {
  background-color: var(--tab-bg, var(--color-secondary));
}
</style>
