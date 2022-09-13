import { createApp } from "vue";
import { defineCustomElements } from "@utrecht/web-component-library-stencil";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useIntersectionObserver } from "@vueuse/core";

declare global {
  interface Window {
    organisatieIds: string[];
    pubBeheerUrl: string;
    gatewayBaseUri: string;
  }
}

// HACK VOOR RARE ORGANISATIE IDS
try {
  window.organisatieIds = window.organisatieIds.map((x) =>
    Number.parseFloat(x).toFixed(0)
  );
} catch (error) {
  console.error(error);
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.mount("#app");

defineCustomElements();
// Register a global custom directive called `v-focus`
app.directive("focus", {
  // When the bound element is mounted into the DOM...
  mounted(el) {
    // start observing whenever the element becomes visible
    const { stop } = useIntersectionObserver(el, (entries) => {
      entries.forEach((x) => {
        if (x.intersectionRatio > 0 && x.target instanceof HTMLElement) {
          // Focus the element
          x.target.focus();
        }
      });
    });
    el.stop = stop;
  },
  // when the bound element is unmounted from the DOM...
  unmounted(el) {
    // stop observing the element
    el.stop();
  },
});

// standard html email validation is not sufficient
const emailregex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function onInput(this: HTMLInputElement) {
  const message = emailregex.test(this.value)
    ? ""
    : "Voer een valide e-mailadres in";

  this.setCustomValidity(message);
}

app.directive("email", {
  mounted(el) {
    if (!(el instanceof HTMLInputElement)) return;
    el.type = "email";
    el.addEventListener("input", onInput);
  },
  unmounted(el) {
    if (!(el instanceof HTMLInputElement)) return;
    el.removeEventListener("input", onInput);
  },
});
