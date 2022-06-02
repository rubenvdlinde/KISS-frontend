<template>
  <header><global-search /></header>
  <main><router-view /></main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { GlobalSearch } from "./features/search";
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

main {
  max-width: var(--container-width);
  padding: 2rem var(--spacing-default);
  gap: var(--spacing-default);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin-left: auto;
  margin-right: auto;
  position: relative;

  > * {
    flex-basis: 100%;
  }
}

utrecht-icon-loupe {
  pointer-events: none;
}

button:hover {
  cursor: pointer;
}

main > section {
  &:not(:only-of-type) {
    max-width: var(--section-width);
  }

  > utrecht-heading:first-child {
    padding-left: var(--text-margin);
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--color-tertiary);
  }
}

section > ul {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  gap: 1.625rem;
}

main > section > p {
  margin-left: var(--text-margin);
  margin-bottom: var(--spacing-default);
  color: var(--color-primary);
}

a[aria-current="page"] {
  color: inherit;
  pointer-events: none;

  &:hover {
    cursor: none;
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
  --denhaag-pagination-color: var(--color-primary);
  --denhaag-pagination-link-current-color: var(--color-headings);

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

// categories
[class^="category-"] {
  border-radius: 1.5rem;
  padding: 0.5em;
  background-color: hsl(184, 54%, 70%);
  display: inline-block;
}
</style>
