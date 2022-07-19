import {
  createRouter,
  createWebHistory,
  type NavigationGuard,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import AfhandelingView from "../views/AfhandelingView.vue";
import ContactmomentView from "../views/ContactmomentView.vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { loginUrl } from "@/features/user";

const guardContactMoment: NavigationGuard = (to, from, next) => {
  const contactmoment = useContactmomentStore();
  if (contactmoment.contactmomentLoopt) {
    next();
  } else {
    next("/");
  }
};

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
      beforeEnter: guardContactMoment,
    },
    {
      path: "/contactmoment/contactmoment",
      name: "contactmoment",
      component: ContactmomentView,
      beforeEnter: guardContactMoment,
    },
    {
      path: "/redirect-to-login",
      beforeEnter: (_, __, next) => {
        sessionStorage.setItem("kiss_close", "true");
        window.location.href = loginUrl;
        return next();
      },
      component: HomeView,
    },
  ],
});

export default router;
