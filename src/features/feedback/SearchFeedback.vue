<template>
  <section v-if="isOpen">
    <utrecht-heading model-value :level="2">Feedback</utrecht-heading>
    <feedback-form
      @cancelled="isOpen = false"
      :id="id"
      :name="name"
    ></feedback-form>
  </section>
  <menu v-else>
    <button @click="toggle" class="utrecht-button">Feedback</button></menu
  >
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import FeedbackForm from "./components/FeedbackForm.vue";

defineProps<{
  id: unknown | URL;
  name: string;
}>();

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);
</script>

<style lang="scss" scoped>
section {
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-default);
  padding: var(--spacing-large);
}
utrecht-heading {
  margin-bottom: var(--spacing-large);
}
</style>
