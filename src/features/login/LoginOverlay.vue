<template>
  <simple-spinner v-if="currentUserState.loading" />
  <template v-else>
    <slot v-if="initialized" :onLogout="onLogout"></slot>
    <dialog ref="dialogRef" @keyup.escape.prevent @keydown.escape.prevent>
      <a
        :href="redirectUrl"
        target="_blank"
        @click="onLinkClick"
        @keydown.enter="onLinkClick"
        >Uw sessie is verlopen. Klik in het scherm om opnieuw in te loggen. Als
        u dit binnen {{ loginTimeoutInSeconds }} seconden doet, verliest u geen
        werk.</a
      >
    </dialog>
  </template>
</template>

<script lang="ts" setup>
import { watch, computed, ref } from "vue";
import { useCurrentUser } from "./service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { handleLogin } from "@/services";
import { loginUrl, redirectUrl, sessionStorageKey } from "./config";
import { useUserStore, type User } from "@/stores/user";

let newTab: Window | null = null;

const loginTimeoutInSeconds = 60;

const messageTypes = {
  refresh: "refresh",
  closeTab: "closeTab",
} as const;

function tryCreateNewTab() {
  if (newTab && !newTab.closed) {
    newTab.focus();
    return true;
  }
  newTab = window.open(redirectUrl);
  return newTab != null;
}

function tryCloseTab() {
  if (newTab && !newTab.closed) {
    newTab.close();
  }
  newTab = null;
}

function refresh() {
  currentUserState.refresh();
}

const channel = new BroadcastChannel(
  // unique name per environment
  "kiss-close-tab-channel-" + window.location.host
);

channel.onmessage = (e) => {
  switch (e.data) {
    case messageTypes.closeTab:
      tryCloseTab();
      break;

    case messageTypes.refresh:
      refresh();
      break;
  }
};

const dialogRef = ref<HTMLDialogElement>();

const currentUserState = useCurrentUser();
const userStore = useUserStore();

const initialized = ref(false);

const isLoggedInRef = computed(
  () => currentUserState.success && currentUserState.data.isLoggedIn
);

const isLoadingRef = computed(() => currentUserState.loading);

function onLogin() {
  initialized.value = true;

  handleLogin();
  channel.postMessage(messageTypes.refresh);
  channel.postMessage(messageTypes.closeTab);

  if (sessionStorage.getItem(sessionStorageKey)) {
    sessionStorage.removeItem(sessionStorageKey);
    document.body.innerHTML =
      "<p>U bent ingelogd. U kunt dit tabblad sluiten.</p>";
  }

  if (dialogRef.value) {
    dialogRef.value.close();
  }
}

function onLogout() {
  channel.postMessage(messageTypes.refresh);
  setTimeout(() => refresh(), 1000);
}

function onLinkClick(e: Event) {
  try {
    if (tryCreateNewTab()) {
      e.preventDefault();
    }
  } catch (error) {
    // popups are blocked, handle the link as usual.
  }
}

function redirectToLogin() {
  window.location.href = loginUrl;
}

// in case of a session expiry, you have a minute to log in again.
// after that, we refresh the page.
// otherwise, another user might be able to see sensitive data by inspecting the HTML with DevTools.
let currentLoginTimoutId: number | undefined;
function resetLoginTimeout() {
  if (currentLoginTimoutId) {
    clearTimeout(currentLoginTimoutId);
  }
  currentLoginTimoutId = setTimeout(() => {
    if (!isLoggedInRef.value) {
      location.reload();
    }
  }, loginTimeoutInSeconds * 1000);
}

watch(
  [isLoadingRef, isLoggedInRef, dialogRef, initialized],
  ([loading, isLoggedIn, dialog, isInitialized]) => {
    if (loading) return;
    if (isLoggedIn) {
      onLogin();
      return;
    }
    // not logged in
    if (!isInitialized) {
      redirectToLogin();
      return;
    }
    if (dialog) {
      resetLoginTimeout();
      dialog.showModal();
    }
  }
);

const computedUser = computed<User>(() =>
  !currentUserState.success ? { isLoggedIn: false } : currentUserState.data
);

watch(computedUser, (u) => {
  userStore.setUser(u);
});
</script>

<style lang="scss" scoped>
dialog[open] {
  width: 100%;
  height: 100%;
  display: grid;
  align-content: stretch;
  justify-content: stretch;

  a {
    display: grid;
    justify-content: center;
    align-content: center;
  }
}
</style>
