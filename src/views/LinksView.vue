<template>
  <utrecht-heading :level="1" model-value>Links</utrecht-heading>
  <link-list />
</template>
<script lang="ts" setup>
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import LinkList from "@/features/links/LinkList.vue";
</script>

<style lang="scss" scoped>
utrecht-heading {
  margin-block-end: var(--spacing-default);
}
</style>
