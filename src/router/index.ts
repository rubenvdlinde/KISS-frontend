import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AfhandelingView from "../views/AfhandelingView.vue";
import ContactmomentView from "../views/ContactmomentView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/contactmoment/afhandeling",
      name: "afhandeling",
      component: AfhandelingView,
    },
    {
      path: "/contactmoment/contactmoment",
      name: "contactmoment",
      component: ContactmomentView,
    },
  ],
});

export default router;
