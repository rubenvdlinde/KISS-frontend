<template>
  <article :class="messageType">
    <slot>{{ message }}</slot>
  </article>
</template>

<script lang="ts" setup>
import { defineProps, toRefs } from "vue";

const props = defineProps({
  messageType: {
    type: String,
    validator: (value) => {
      return value == "error" || value == "confirm";
    },
    default: "confirm",
  },
  message: String,
});

const { messageType, message } = toRefs(props);
</script>

<style lang="scss" scoped>
article {
  color: #fff;
  padding: var(--spacing-default);
  border-radius: var(--radius-default);
}

.error {
  background-color: var(--color-error);
}

.confirm {
  background-color: var(--color-accent);
}
</style>
