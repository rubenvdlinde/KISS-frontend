<template>
  <simple-spinner v-if="categories.loading" />
  <application-message
    v-if="categories.error"
    :message-type="'error'"
    message="Er ging iets mis. Probeer het later nog eens."
  />
  <nav v-if="categories.success">
    <dl v-if="categories.data.length">
      <template v-for="[category, links] in categories.data" :key="category">
        <dt>{{ category }}</dt>
        <dd v-for="link in links" :key="link.id">
          <a :href="link.url" rel="noopener noreferrer" target="_blank">{{
            link.title
          }}</a>
        </dd>
      </template>
    </dl>
    <p v-else>Geen links gevonden.</p>
  </nav>
</template>

<script lang="ts" setup>
import { useLinksPerCategory } from "./service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";

const categories = useLinksPerCategory();
</script>

<style lang="scss" scoped>
dt {
  font-weight: 600;
  margin-block-end: var(--spacing-small);

  &:not(:first-of-type) {
    margin-block-start: var(--spacing-default);
  }
}

a:not(:visited) {
  color: #2e71d7;
}
</style>
