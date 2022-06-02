import { createApp } from "vue";
import { defineCustomElements } from "@utrecht/web-component-library-stencil";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

declare global {
  interface Window {
    openPubBaseUri: string;
    contactmomentenBaseUri: string;
    organisatieIds: string[];
  }
}

const app = createApp(App);


app.use(createPinia());
app.use(router);
app.mount("#app");

defineCustomElements();
