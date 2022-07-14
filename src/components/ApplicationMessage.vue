<template>
  <article :class="[messageType, { fade }]">
    <slot>{{ message }}</slot>
  </article>
</template>

<script lang="ts" setup>
import { defineProps, toRefs, onMounted, ref } from "vue";

const fade = ref(false);
const props = defineProps({
  messageType: {
    type: String,
    validator: (value) => {
      return value == "error" || value == "confirm";
    },
    default: "confirm",
  },
  message: String,
  autoClose: Boolean,
});

const { messageType, message } = toRefs(props);

onMounted(() => {
  setTimeout(() => {
    fade.value = props.autoClose;
  }, 3000);
});
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

.fade {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s linear 2000ms, opacity 2000ms;
}
</style>
