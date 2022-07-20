<template>
  <SimpleSpinner v-if="currentUserState.loading" />
  <template v-else>
    <slot v-if="initialized"></slot>
    <dialog ref="dialogRef" @keyup.escape.prevent @keydown.escape.prevent>
      <a
        :href="redirectUrl"
        target="_blank"
        @click="onLinkClick"
        @keydown.enter="onLinkClick"
        >Uw sessie is verlopen. Klik in het scherm om opnieuw in te loggen.</a
      >
    </dialog>
  </template>
</template>

<script lang="ts" setup>
import { watch, computed, ref } from "vue";
import { useCurrentUser } from "./service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { handleLogin } from "@/services";
import { loginUrl, redirectUrl, sessionStorageKey } from "./config";

let newTab: Window | null = null;

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

const channel = new BroadcastChannel(
  // unique name per environment
  "kiss-close-tab-channel-" + window.location.host
);

channel.onmessage = () => {
  currentUserState.refresh();
  tryCloseTab();
};

const dialogRef = ref<HTMLDialogElement>();

const currentUserState = useCurrentUser();

const initialized = ref(false);

const isLoggedInRef = computed(
  () => currentUserState.success && currentUserState.data.isLoggedIn
);

const isLoadingRef = computed(() => currentUserState.loading);

function onLogin() {
  initialized.value = true;

  handleLogin();
  channel.postMessage("close");

  const shouldClose = !!sessionStorage.getItem(sessionStorageKey);
  if (shouldClose) {
    document.body.innerHTML = "<p>U ben ingelogd. U kunt deze tab sluiten.</p>";
  }

  if (dialogRef.value) {
    dialogRef.value.close();
  }
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
      dialog.showModal();
    }
  }
);
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
