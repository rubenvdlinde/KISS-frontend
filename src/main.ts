import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

import { defineCustomElements } from "@utrecht/web-component-library-stencil";



const app = createApp(App);

app.use(router);

app.mount("#app");

defineCustomElements();
