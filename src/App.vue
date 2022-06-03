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
</style>
