<template>
  <header :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }">
    <global-search />
  </header>
  <main><router-view /></main>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { GlobalSearch } from "./features/search";
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmoment = useContactmomentStore();
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
  --color-accent: #58af23;
  --color-error: #d44;
  --color-category-default: hsl(184, 54%, 70%);
  --color-category-website: hsl(285, 56%, 83%);

  // spacing
  --container-width: 69.375rem;
  --section-width: 30.75rem;
  --spacing-default: 1rem;
  --header-height: 6rem;
  --text-margin: 1.5rem;

  // other
  --radius-default: 0.5rem;
}

body {
  font-family: var(--utrecht-paragraph-font-family);
}

#app > header.contactmomentLoopt {
  border-top-color: var(--color-accent);
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

.search-bar {
  display: inline-flex;
  align-items: stretch;
  max-width: 100%;
  --border-style: 1px solid var(--color-primary);

  input,
  select,
  button {
    border: none;
    border-block: var(--border-style);

    &:focus {
      outline-color: var(--color-primary);
    }
  }

  > :first-child {
    input,
    select {
      border-radius: 1.5rem 0 0 1.5rem;
      border-inline-start: var(--border-style);
    }
  }

  > :last-child {
    border-radius: 0 1.5rem 1.5rem 0;
    border-inline-end: var(--border-style);
  }

  button {
    --utrecht-icon-size: 1rem;
    background: white;
    font-size: 0;
    padding-right: var(--spacing-default);
  }

  utrecht-icon-loupe {
    pointer-events: none;
  }

  input,
  select {
    padding: 0.5rem;
  }

  label {
    font-size: 0;
    display: flex;
    align-items: stretch;
  }

  input[type="search"] {
    padding-inline-start: 1rem;
    &::placeholder {
      color: black;
    }
  }

  input,
  select {
    width: 100%;
  }
}

.icon-before,
.icon-after {
  align-items: center;
}

.icon-after::after,
.icon-before::before {
  display: block;
  content: "";
  background-color: currentColor;
  mask-repeat: no-repeat;
  width: 1rem;
  height: 1rem;
}

.icon-before.chevron-down::before,
.icon-after.chevron-down::after {
  height: 0.5rem;
  mask-image: url("@/assets/icons/chevron-down.svg");
}

.icon-before.circle-xmark::before,
.icon-after.circle-xmark::after {
  mask-image: url("@/assets/icons/circle-xmark.svg");
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

  /* button */
  --utrecht-button-background-color: var(--color-primary);
  --utrecht-button-border-color: var(--color-primary);
  --utrecht-button-secondary-action-border-color: var(
    --utrecht-button-border-color
  );
  --utrecht-button-secondary-action-color: var(--color-primary);

  /* forms */
  --utrecht-form-fieldset-legend-font-size: 1.5rem;
  --utrecht-form-fieldset-legend-font-weight: bold;
  --utrecht-form-fieldset-legend-line-height: 2rem;

  --utrecht-form-label-font-size: 1rem;
}

utrecht-button {
  --utrecht-button-border-radius: 100px;
  --utrecht-button-min-inline-size: 150px;
}

// categories
[class^="category-"],
[class*=" category-"] {
  border-radius: 1.5rem;
  padding: 0.5em;
  background-color: var(--color-category-default);
  display: inline-block;
}

.category-Website {
  background-color: var(--color-category-website);
}
</style>
