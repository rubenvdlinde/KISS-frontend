<template>
  <header></header>
  <main><router-view /></main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="scss">
@import "@/assets/reset.css";
@import "@/assets/fonts/fonts.css";

/* Design Tokens */
@import "@gemeente-denhaag/design-tokens-components/dist/index.css";

:root {
  // colors
  --color-primary: #415a77;
  --color-secondary: #eceff1;
  --color-tertiary: #778da9;

  // spacing
  --container-width: 69.375rem;
  --section-width: 30.75rem;
  --spacing-default: 1rem;
  --header-height: 6rem;
  --text-margin: 1.5rem;

  // typography
  --font-family: "Open Sans", sans-serif;
}

html {
  font-family: var(--utrecht-paragraph-font-family);
}

#app > header {
  min-height: var(--header-height);
  background-color: var(--color-primary);
}

main {
  max-width: var(--container-width);
  padding: 2rem var(--spacing-default);
  gap: var(--spacing-default);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;

  > * {
    flex-basis: 100%;
  }
}
</style>
