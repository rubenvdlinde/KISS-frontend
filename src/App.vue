<template>
  <header
    :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }"
  ></header>
  <main><router-view /></main>
</template>

<script setup lang="ts">
//import { ref, watch } from "vue";
import { RouterView } from "vue-router";
import { useContactmomentStore } from "@/stores/contactmoment";

const contactmoment = useContactmomentStore();
//const contactmomentClass = ref("");

// watch(
//   () => contactmoment.contactmomentLoopt,
//   (contactmomentLooptValue) => {
//     contactmomentClass.value = contactmomentLooptValue
//       ? "contactmomentLoopt"
//       : "";
//   }
// );
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

  // spacing
  --container-width: 69.375rem;
  --section-width: 30.75rem;
  --spacing-default: 1rem;
  --spacing-small: 0.5rem;
  --spacing-large: 2rem;
  --header-height: 6rem;
  --text-margin: 1.5rem;

  // other
  --radius-default: 0.5rem;
}

body {
  font-family: var(--utrecht-paragraph-font-family);
}

#app > header {
  min-height: var(--header-height);
  background-color: var(--color-primary);
  border-style: solid;
  border-top-width: 6px;
  border-top-color: var(--color-primary);
}

#app > header.contactmomentLoopt {
  border-top-color: var(--color-accent);
}

main {
  min-width: var(--container-width);
  max-width: 80%;
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

.tabs-component {
  ul li.is-active {
    background-color: var(--color-secondary);
    border-radius: var(--radius-default) var(--radius-default) 0 0;
  }

  ul li {
    display: inline-block;
    padding: var(--spacing-default);

    a {
      text-decoration: none;
      font-size: var(--utrecht-typography-scale-lg);
      color: var(--utrecht-document-color);
    }
  }

  > div {
    background-color: var(--color-secondary);
  }
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

::placeholder {
  color: red;
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
  --utrecht-heading-3-font-size: var(--utrecht-typography-scale-lg);

  --utrecht-typography-scale-lg: 1.25rem;

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

  --utrecht-form-input-border-color: var(--color-primary);
  --utrecht-form-input-border-radius: var(--radius-default);

  --utrecht-form-input-padding-block-end: var(--spacing-small);
  --utrecht-form-input-padding-block-start: var(--spacing-small);

  --utrecht-form-input-placeholder-color: #999;
}

utrecht-button {
  --utrecht-button-border-radius: 100px;
  --utrecht-button-min-inline-size: 150px;

  --utrecht-button-padding-inline-start: 1rem;
  --utrecht-button-padding-inline-end: 1rem;
  --utrecht-button-min-block-size: 1rem;

  --utrecht-button-padding-block-start: 0.6rem;
  --utrecht-button-padding-block-end: 0.6rem;
}

utrecht-button.button-small {
  --utrecht-button-padding-inline-start: 1rem;
  --utrecht-button-padding-inline-end: 1rem;
  --utrecht-button-min-block-size: 1rem;
  --utrecht-button-min-inline-size: 1rem;
  --utrecht-button-padding-block-start: 0.6rem;
  --utrecht-button-padding-block-end: 0.6rem;
}
</style>
