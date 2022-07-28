import { createApp } from "vue";
import { defineCustomElements } from "@utrecht/web-component-library-stencil";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

declare global {
  interface Window {
    organisatieIds: string[];
    pubBeheerUrl: string;
    gatewayBaseUri: string;
  }
}

// HACK VOOR RARE ORGANISATIE IDS
window.organisatieIds = window.organisatieIds.map((x) =>
  Number.parseFloat(x).toFixed(0)
);

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");

defineCustomElements();

// Register a global custom directive called `v-focus`
app.directive("focus", {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // Focus the element
    el.focus();
  },
});
