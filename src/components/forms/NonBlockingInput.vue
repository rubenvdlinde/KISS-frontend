<template>
  <input
    v-bind="$attrs"
    :id="id"
    :value="modelValue"
    @input="onInput"
    @blur="setDirty"
  />
  <template v-if="isDirty">
    <label v-for="(message, i) in messages" :key="i" :for="id" class="error">
      {{ message }}
    </label>
  </template>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { nanoid } from "nanoid";
import { computed, type InputHTMLAttributes, ref } from "vue";
import { useValidationMessages } from "./useValidationMessages";
export interface NonBlockingInputProps extends InputHTMLAttributes {
  modelValue: string;
  name: string;
  validate?: (val: string) => string[];
}
const props = defineProps<NonBlockingInputProps>();
const emit = defineEmits(["update:modelValue", "input"]);
const isDirty = ref(false);

function setDirty() {
  if (props.modelValue) {
    isDirty.value = true;
  }
}

const messages = useValidationMessages(props);

const id = computed(() => props.id ?? nanoid());

function onInput(e: InputEvent) {
  const { currentTarget } = e;
  if (!(currentTarget instanceof HTMLInputElement)) return;
  const { value } = currentTarget;
  emit("update:modelValue", value);
  emit("input", e);
}
</script>

<style lang="scss">
.error {
  color: var(--color-error);
}
</style>
