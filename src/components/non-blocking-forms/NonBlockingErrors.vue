<template>
  <slot :inputProps="inputProps"></slot>
  <ul v-if="isDirty && messages.length && showMessages" class="error" :id="id">
    <li v-for="(message, i) in messages" :key="i">
      {{ message }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useValidationMessages } from "./useValidationMessages";

const props = defineProps<{
  showMessages?: boolean;
  value: string;
  validate: (val: string) => string[];
}>();

const { messages, inputProps, isDirty, id } = useValidationMessages(props);
</script>

<style lang="scss">
.error {
  color: var(--color-error);
}
</style>
