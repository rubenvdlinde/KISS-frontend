<template>
  <!-- <a :href="loginUrl" v-if="!roles.length">Login</a> -->
  <a :href="loginUrl" v-if="false">Login</a>
  <template v-else>
    <header :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }">
      <global-search>
        <template #articleFooter="{ id, title }">
          <search-feedback :id="id" :name="title"></search-feedback>
        </template>
      </global-search>
    </header>
    <router-view />
  </template>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { GlobalSearch } from "./features/search";
import { useContactmomentStore } from "@/stores/contactmoment";
import SearchFeedback from "./features/feedback/SearchFeedback.vue";
import { useCurrentUserRoles } from "./features/user";

const contactmoment = useContactmomentStore();
const roles = useCurrentUserRoles();
const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";
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
  --container-width: 80rem;
  --container-padding: max(
    var(--spacing-default),
    calc(50vw - var(--container-width) / 2)
  );
  --section-width: 30.75rem;
  --section-width-small: 20rem;
  --section-width-large: 60rem;

  --spacing-default: 1rem;
  --spacing-small: 0.5rem;
  --spacing-large: 2rem;
  --header-height: 6rem;
  --text-margin: 1.5rem;

  // other
  --radius-default: 0.5rem;
  --radius-medium: 1rem;
  --radius-large: 1.5rem;

  --height-body: 100vh;
}

body {
  font-family: var(--utrecht-paragraph-font-family);
}

#app {
  position: relative;
}

#app > header.contactmomentLoopt {
  border-top-color: var(--color-accent);
}

utrecht-icon-loupe {
  pointer-events: none;
}

button:hover {
  cursor: pointer;
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

main {
  gap: var(--spacing-default);
  padding-inline: var(--container-padding);
  padding-block: var(--spacing-large);
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  position: relative;

  > * {
    flex-basis: 100%;
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

a[aria-current="page"] {
  color: inherit;
  pointer-events: none;

  &:hover {
    cursor: none;
  }
}

h2 {
  margin-top: var(--spacing-large);
}

::placeholder {
  color: red;
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

    &:focus-visible {
      outline-color: var(--color-primary);
    }
  }

  > :first-child {
    input,
    select {
      border-radius: var(--radius-large) 0 0 var(--radius-large);
      border-inline-start: var(--border-style);
    }
  }

  > :last-child {
    border-radius: 0 var(--radius-large) var(--radius-large) 0;
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
    color: var(--color-error);
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

.icon-large::after,
.icon-large::before {
  width: 1.5rem;
  height: 1.5rem;
}

.icon-before.chevron-down::before,
.icon-after.chevron-down::after {
  height: 0.6rem;
  mask-image: url("@/assets/icons/chevron-down.svg");
}

.icon-before.circle-xmark::before,
.icon-after.circle-xmark::after {
  mask-image: url("@/assets/icons/circle-xmark.svg");
}

.icon-before.filter::before,
.icon-after.filter::after {
  mask-image: url("@/assets/icons/filter.svg");
}

.icon-before.check::before,
.icon-after.check::after {
  mask-image: url("@/assets/icons/check.svg");
}

//forms
form {
  label {
    span.required {
      color: var(--color-error);
      padding-left: var(--spacing-small);
    }
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

utrecht-button,
.utrecht-button {
  --utrecht-button-border-radius: 100px;
  --utrecht-button-min-inline-size: 150px;

  --utrecht-button-padding-inline-start: 1rem;
  --utrecht-button-padding-inline-end: 1rem;
  --utrecht-button-min-block-size: 1rem;

  --utrecht-button-padding-block-start: 0.6rem;
  --utrecht-button-padding-block-end: 0.6rem;

  --utrecht-button-secondary-action-background-color: transparent;
}

utrecht-button.button-small {
  --utrecht-button-padding-inline-start: 1rem;
  --utrecht-button-padding-inline-end: 1rem;
  --utrecht-button-min-block-size: 1rem;
  --utrecht-button-min-inline-size: 1rem;
  --utrecht-button-padding-block-start: 0.6rem;
  --utrecht-button-padding-block-end: 0.6rem;
}

.utrecht-button {
  background-color: var(--utrecht-button-background-color);

  border-color: var(
    --utrecht-button-border-bottom-color,
    var(--utrecht-button-border-color, transparent)
  );

  border-width: var(
    --utrecht-button-border-bottom-width,
    var(--utrecht-button-border-width, 0)
  );
  color: var(--utrecht-button-color);
  font-family: var(
    --utrecht-button-font-family,
    var(--utrecht-document-font-family)
  );
  font-size: var(
    --utrecht-button-font-size,
    var(--utrecht-document-font-family)
  );
  font-weight: var(--utrecht-button-font-weight);
  inline-size: var(--utrecht-button-inline-size, auto);
  letter-spacing: var(--utrecht-button-letter-spacing);
  line-height: var(--utrecht-button-line-height);
  min-block-size: var(--utrecht-button-min-block-size, 44px);
  min-inline-size: var(--utrecht-button-min-inline-size, 44px);
  padding-block-end: var(--utrecht-button-padding-block-end);
  padding-block-start: var(--utrecht-button-padding-block-start);
  padding-inline-end: var(--utrecht-button-padding-inline-end);
  padding-inline-start: var(--utrecht-button-padding-inline-start);
  text-transform: var(--utrecht-button-text-transform);
  user-select: none;
  border-radius: var(--utrecht-button-border-radius);
  border-style: solid;
}

.utrecht-button--secondary-action {
  background-color: var(
    --utrecht-button-secondary-action-background-color,
    var(--utrecht-button-background-color)
  );
  border-color: var(
    --utrecht-button-secondary-action-border-color,
    var(--utrecht-button-border-color)
  );
  border-width: var(
    --utrecht-button-secondary-action-border-width,
    var(--utrecht-button-border-width)
  );
  color: var(
    --utrecht-button-secondary-action-color,
    var(--utrecht-button-color)
  );
}

// categories
[class^="category-"],
[class*=" category-"] {
  border-radius: 1.5rem;
  padding-inline: 0.75rem;
  padding-block: 0.5em;
  background-color: var(--color-category-default);
  display: inline-block;
}

.category-Website {
  background-color: var(--color-category-website);
}
</style>
