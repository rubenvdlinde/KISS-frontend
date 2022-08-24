<template>
  <div>
    <input
      type="tel"
      v-bind="$attrs"
      :value="modelValue"
      ref="inputEl"
      @input="updateModelValue"
    />
    <label v-if="message"
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
  > * {
    grid-column: 1 / 1;
    grid-row: 1 / 1;
  }
}
</style>
