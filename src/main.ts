import { createApp } from "vue";
import { defineCustomElements } from "@utrecht/web-component-library-stencil";
import App from "./App.vue";
import router from "./router";


const app = createApp(App);

app.use(router);

app.mount("#app");

defineCustomElements();
