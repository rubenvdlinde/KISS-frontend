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
  --color-headings: #1b263b;
  --utrecht-button-background-color: var(--color-primary);

  // spacing
  --container-width: 69.375rem;
  --section-width: 30.75rem;
  --spacing-default: 1rem;
  --header-height: 6rem;
  --text-margin: 1.5rem;
}

body {
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

.kiss-theme {
  --font-family: "Open Sans", sans-serif;
  --utrecht-paragraph-font-family: var(--font-family);
  --utrecht-paragraph-color: black;
  --utrecht-heading-font-family: var(--font-family);
  --utrecht-document-font-family: var(--font-family);
  --utrecht-document-font-size: 1rem;
  --utrecht-document-color: black;
  --utrecht-heading-color: var(--color-headings);
  --utrecht-paragraph-font-size: 1rem;
  --utrecht-heading-font-weight: 600;

  /* h1 */
  --utrecht-heading-1-line-height: 4.25rem;
  --utrecht-heading-1-font-size: 2.5rem;

  /* h2 */
  --utrecht-heading-2-line-height: 2rem;
  --utrecht-heading-2-font-size: 1.5rem;

  /* h3 */
  --utrecht-heading-3-line-height: 2rem;
  --utrecht-heading-3-font-size: 1.25rem;
}
</style>
