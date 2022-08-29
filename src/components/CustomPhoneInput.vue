<template>
  <div>
    <input
      type="tel"
      v-bind="$attrs"
      :value="modelValue"
      ref="inputEl"
      @input="updateModelValue"
      @blur="isDirty = true"
    />
    <span
      v-if="isDirty"
      :class="['confirmed icon-after', message ? 'xmark' : 'check']"
      :title="message ? message : confirmed ? 'Bevestigd' : 'Valide'"
    />
    <label v-if="message && isDirty"
      >{{ message }}<input type="checkbox" v-model="confirmed"
    /></label>
  </div>
</template>
<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<script lang="ts" setup>
import { ref, watch, computed } from "vue";

const emit = defineEmits(["update:modelValue"]);

function isValidPhoneNumber(val: string) {
  const numberCount = (val.match(/[0-9]/g) ?? []).length;
  const hasOnlyAllowedChars = /^(\+|-| |[0-9])*$/.test(val);
  return numberCount >= 10 && hasOnlyAllowedChars;
}

function updateModelValue(e: Event) {
  if (e.target instanceof HTMLInputElement) {
    emit("update:modelValue", e.target.value);
  }
}

const props = defineProps<{ modelValue: string }>();
const confirmed = ref(false);
const isDirty = ref(false);
const inputEl = ref<HTMLInputElement>();
const message = computed(() =>
  !confirmed.value && !isValidPhoneNumber(props.modelValue)
    ? "Dit lijkt geen valide telefoonnummer. Weet u het zeker?"
    : ""
);

watch(
  () => props.modelValue,
  () => {
    confirmed.value = false;
  }
);

watch(
  [message, inputEl],
  ([m, e]) => {
    if (!e) return;
    e.setCustomValidity(m);
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
div {
  display: grid;
  > input,
  > span {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }

  label {
    background-color: rgba($color: #ddd, $alpha: 0.75);
    padding: var(--spacing-default);
    border-radius: var(--radius-default);
    display: flex;
    line-height: var(--line-height-default);

    &:hover {
      cursor: pointer;
    }
  }

  input[type="checkbox"] {
    transform: scale(150%);

    &:hover {
      cursor: pointer;
    }
  }
}

.confirmed {
  font-size: 0;
  margin-inline-start: auto;
  margin-inline-end: var(--spacing-default);
  margin-block-end: auto;
  margin-block-start: auto;
  color: var(--color-accent);

  &.xmark {
    color: var(--color-error);
  }
}
</style>
