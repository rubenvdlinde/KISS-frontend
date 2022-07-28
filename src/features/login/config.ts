import type { RouteRecordRaw } from "vue-router";
import RedirectPage from "./RedirectPage.vue";

const baseUri = new URL(location.href);
baseUri.pathname = "";
const logoutUri = new URL(window.gatewayBaseUri + "/logout");
logoutUri.searchParams.set("redirectUrl", baseUri.toString());

export const meUrl = window.gatewayBaseUri + "/me";
export const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";
export const logoutUrl = logoutUri.toString();
export const redirectUrl = "/redirect-to-login";
export const sessionStorageKey = "kiss_close";

export const redirectRoute = {
  component: RedirectPage,
  path: redirectUrl,
  beforeEnter() {
    // session storage is owned per tab.
    // we use this to check if we redirected to the login provider from this page.
    // this value is read in the LoginOverlay after a successful login.
    sessionStorage.setItem(sessionStorageKey, "true");
    window.location.href = loginUrl;
  },
} as RouteRecordRaw;
