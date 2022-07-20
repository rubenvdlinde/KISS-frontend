import type { RouteRecordRaw } from "vue-router";
import RedirectPage from "./RedirectPage.vue";

export const meUrl = window.gatewayBaseUri + "/me";
export const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";
export const logoutUrl = window.gatewayBaseUri + "/logout";
export const redirectUrl = "/redirect-to-login";
export const sessionStorageKey = "kiss_close";

export const redirectRoute = {
  component: RedirectPage,
  path: redirectUrl,
  beforeEnter() {
    sessionStorage.setItem(sessionStorageKey, "true");
    window.location.href = loginUrl;
  },
} as RouteRecordRaw;
