<template>
  <login-overlay>
    <template #default="{ onLogout }">
      <the-toast-section />
      <div
        class="app-layout"
        :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }"
      >
        <header
          :class="{ contactmomentLoopt: contactmoment.contactmomentLoopt }"
        >
          <global-search v-if="route.meta.showSearch">
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
        <nav v-if="contactmoment.contactmomentLoopt && route.meta.showNav">
          <li>
            <router-link :to="{ name: 'home' }">Start</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'klanten' }">Klanten</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'zaken' }">Zaken</router-link>
          </li>
        </nav>
        <aside
          v-if="contactmoment.contactmomentLoopt && route.meta.showNotitie"
        >
          <menu></menu>
          <tabs-component v-model="currentNotitieTab" class="notitie-tabs">
            <template #tab="{ tabName }">
              <span
                :title="tabName"
                :class="[
                  'icon-after',
                  tabName === NotitieTabs.Terugbel ? 'phone-flip' : 'note',
                ]"
                >{{ tabName }}</span
              >
            </template>
            <template #[NotitieTabs.Regulier]>
              <contactmoment-notitie
                class="notitie utrecht-textarea"
              ></contactmoment-notitie>
            </template>
            <template #[NotitieTabs.Terugbel]>
              <contactverzoek-formulier
                @isDirty="handleContactverzoekIsDirty"
              />
            </template>
          </tabs-component>
        </aside>
        <main>
          <router-view />
        </main>
      </div>
      <contactmoment-starter
        v-if="route.meta.showSearch"
        :beforeStopWarning="
          contactverzoekTabIsDitry && contactverzoekIsDirty
            ? 'Let op, u heeft een contactverzoek niet afgerond. Als u dit contactmoment afsluit wordt het contactverzoek niet verstuurt.'
            : ''
        "
      />
    </template>
  </login-overlay>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { GlobalSearch } from "@/features/search";
import { useContactmomentStore } from "@/stores/contactmoment";
import { SearchFeedback } from "@/features/feedback";
import { logoutUrl, LoginOverlay } from "@/features/login";
import TheToastSection from "@/components/TheToastSection.vue";
import { ContactmomentStarter } from "@/features/contactmoment";
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import { ContactmomentNotitie } from "@/features/contactmoment";
import { ContactverzoekFormulier } from "@/features/contactverzoek";
import TabsComponent from "@/components/TabsComponent.vue";

enum NotitieTabs {
  Regulier = "Reguliere notitie",
  Terugbel = "Contactverzoek",
}
const currentNotitieTab = ref(NotitieTabs.Regulier);

const contactverzoekIsDirty = ref(false);

const handleContactverzoekIsDirty = (isDirty: boolean) => {
  contactverzoekIsDirty.value = isDirty;
};

const contactverzoekTabIsDitry = ref(false);

watch(currentNotitieTab, (t: string) => {
  if (t === NotitieTabs.Terugbel) {
    contactverzoekTabIsDitry.value = true;
  }
});
//Notities end

const contactmoment = useContactmomentStore();

const route = useRoute();
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
  --color-white: #fff;

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
  --spacing-extrasmall: 0.25rem;

  --header-height: 6rem;
  --text-margin: 1.5rem;

  --line-height-default: 1.5;

  // other
  --radius-default: 0.5rem;
  --radius-medium: 1rem;
  --radius-large: 1.5rem;

  --height-body: 100vh;
}

html,
body,
.app-layout {
  height: 100%;
  line-height: var(--line-height-default);
}

body {
  font-family: var(--utrecht-paragraph-font-family);
}

.app-layout {
  position: relative;
  height: 100vh;
  display: grid;
  grid-template-rows: auto auto 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "header"
    "nav"
    "main";
}

.app-layout.contactmomentLoopt {
  grid-template-columns: 1fr 4fr;
  grid-template-areas:
    "header  header"
    "nav     nav"
    "aside   main";
}

.app-layout > header {
  grid-area: header;
}
.app-layout > nav {
  grid-area: nav;
}
.app-layout > aside {
  grid-area: aside;
}
.app-layout > main {
  max-width: calc(100vw - (var(--container-padding) * 2));
  grid-area: main;
  padding: var(--spacing-large);
}

.app-layout:not(.contactmomentLoopt) > main {
  margin: 0 auto;
}

.app-layout > header {
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
    color: var(--color-white);
    padding: var(--spacing-small);
    margin-left: auto;
  }
}

.app-layout > nav {
  border-top: 1px solid var(--color-tertiary);
  width: 100%;
  background-color: var(--color-primary);
  display: flex;
  justify-content: center;
  gap: var(--spacing-default);
  padding-block: var(--spacing-small);
  list-style: none;
  li {
    margin-inline: var(--spacing-large);
  }
  a {
    text-decoration: none;
    color: var(--color-white);
  }

  a.router-link-active {
    border-bottom: 2px solid var(--color-white);
  }
}

.app-layout {
  border-top: 4px solid var(--color-primary);
}
.app-layout.contactmomentLoopt {
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
    background-color: var(--color-white);
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
    background: var(--color-white);
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

.icon-before.phone-flip::before,
.icon-after.phone-flip::after {
  mask-image: url("@/assets/icons/phone-flip.svg");
}

.icon-before.note::before,
.icon-after.note::after {
  mask-image: url("@/assets/icons/note.svg");
}

.icon-before.pen::before,
.icon-after.pen::after {
  mask-image: url("@/assets/icons/pen.svg");
}

.icon-before.xmark::before,
.icon-after.xmark::after {
  mask-image: url("@/assets/icons/xmark.svg");
}

.icon-before.plus::before,
.icon-after.plus::after {
  mask-image: url("@/assets/icons/plus.svg");
}

//forms
form {
  span.required::after {
    content: "*";
    color: var(--color-error);
    padding-left: 1ch;
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

  --utrecht-form-input-disabled-border-color: #999;
  --utrecht-form-input-disabled-color: #999;
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

// main {
//   padding-inline: 0;
//   padding-block: 0;
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
//   // grid-template-columns: 1fr 4fr;
// }

aside {
  grid-column: 1;

  background-color: var(--color-tertiary);
  padding-inline: 2px;
  display: grid;
  grid-template-rows: auto 1fr;

  textarea.utrecht-textarea {
    padding: 0px;
  }

  menu {
    background-color: var(--color-tertiary);
  }

  menu,
  [role="tablist"] {
    height: 3rem;
  }
}

//notities start

.contactmomenten-header {
  margin-inline-start: var(--spacing-default);
}

.notitie {
  margin-top: var(--spacing-large);
  outline: none;
  border: none;
  width: 100%;
}

.icon-after {
  font-size: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.notitie-tabs {
  --tab-bg: var(--color-white);

  [role="tablist"] {
    padding: 0;
    justify-items: stretch;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  [role="tabpanel"] {
    padding: var(--spacing-default);
    display: flex;
    flex-direction: column;
  }

  [role="tab"] {
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-white);

    &[aria-selected="true"] {
      color: var(--color-tertiary);
    }
  }
}

.notitieveld {
  display: flex;
  flex-direction: column;
  //flex: 1;
}

.notitieveld textarea.utrecht-textarea {
  padding: var(--spacing-small);
  margin-block-start: 0;
  min-height: 20rem;
}
</style>
