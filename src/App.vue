<template>
  <login-overlay>
    <template #default="{ onLogout }">
      <the-toast-section />
      <header :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }">
        <global-search @medewerkerSelected="addMedewerkerToContactmoment">
          <template #articleFooter="{ id, title }">
            <search-feedback :id="id" :name="title"></search-feedback>
          </template>
        </global-search>
        <a
          :href="logoutUrl"
          @click="onLogout"
          @keydown.enter="onLogout"
          class="log-out"
          >Uitloggen</a
        >
      </header>
      <router-view />
    </template>
  </login-overlay>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { GlobalSearch } from "./features/search";
import { useContactmomentStore } from "@/stores/contactmoment";
import SearchFeedback from "./features/feedback/SearchFeedback.vue";
import { logoutUrl, LoginOverlay } from "./features/login";
import TheToastSection from "./components/TheToastSection.vue";

const contactmoment = useContactmomentStore();

const addMedewerkerToContactmoment = (
  email: string,
  telefoonnummer: string,
  naam: string
) => {
  if (contactmoment.contactmomentLoopt) {
    contactmoment.addMedewerker(email, telefoonnummer, naam);
  }
};
</script>

<style lang="scss">
@import "@/assets/reset.css";
@import "@/assets/fonts/fonts.css";
@import "@utrecht/component-library-css";

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
  --spacing-extralarge: 6rem;

  --header-height: 6rem;
  --text-margin: 1.5rem;

  // other
  --radius-default: 0.5rem;
  --radius-medium: 1rem;
  --radius-large: 1.5rem;

  --height-body: 100vh;
}

html,
body,
#app {
  height: 100%;
}

body {
  font-family: var(--utrecht-paragraph-font-family);
}

#app {
  position: relative;
  display: grid;
  grid-auto-rows: minmax(min-content, max-content);
}

#app > header {
  background-color: var(--color-primary);
  display: grid;
  grid-template-areas:
    "padleft gap bar logout padright"
    "results results results results results"
    "expand expand expand expand expand";
  grid-template-columns: var(--container-padding) 1fr 2fr 1fr var(
      --container-padding
    );
  align-items: center;

  .log-out {
    grid-area: logout;
    color: white;
    padding: var(--spacing-small);
    margin-left: auto;
  }
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

.main-tabs > nav {
  background-color: var(--color-secondary);
}

.tabs-component-zaken {
  > ul li.is-active {
    background-color: var(--color-secondary);
    border-radius: var(--radius-default) var(--radius-default) 0 0;
  }

  > ul li {
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

.tabs-component-contactmoment {
  > ul li.is-active {
    background-color: white;
  }

  > ul li {
    display: inline-block;
    padding: var(--spacing-default);

    a {
      text-decoration: none;
      font-size: var(--utrecht-typography-scale-lg);
      color: var(--utrecht-document-color);
    }
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

  > :nth-last-child(2) {
    flex: 1;
    > input {
      width: 100%;
    }
  }

  input[type="search"] {
    padding-inline-start: 1rem;
    &::placeholder {
      color: black;
    }
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

menu {
  list-style: none;
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
  --utrecht-border-width-sm: 1px;
  --utrecht-color-grey-90: var(--color-tertiary);

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
  --utrecht-form-fieldset-legend-font-weight: 600;
  --utrecht-form-fieldset-legend-line-height: 2rem;

  --utrecht-form-label-font-weight: 600;
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
