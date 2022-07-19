<template>
  <SimpleSpinner v-if="currentUserState.loading" />
  <template v-else>
    <slot v-if="initialized"></slot>
    <dialog ref="dialog" @keyup.escape.prevent @keydown.escape.prevent>
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
import { watch, computed, ref, watchEffect } from "vue";
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
  shouldShowLogin.value = false;
  tryCloseTab();
};

const dialog = ref<HTMLDialogElement>();

const currentUserState = useCurrentUser();

const shouldShowLogin = ref(true);

const initialized = ref(false);

watchEffect(() => {
  shouldShowLogin.value =
    !currentUserState.success || !currentUserState.data.isLoggedIn;
});

const isLoggedIn = computed(
  () => currentUserState.success && currentUserState.data.isLoggedIn
);

const disposeOnInitialLoginCheck = watchEffect(() => {
  if (!currentUserState.success) return;
  if (currentUserState.data.isLoggedIn) {
    initialized.value = true;
  } else {
    window.location.href = loginUrl;
  }
  disposeOnInitialLoginCheck();
});

watch([shouldShowLogin, dialog], ([x, d]) => {
  if (!initialized.value) return;
  if (x) {
    if (d) {
      d.showModal();
    }
  } else if (d) {
    d.close();
  }
});

watch(isLoggedIn, (x) => {
  if (x) {
    handleLogin();
    channel.postMessage("close");
    const shouldClose = !!sessionStorage.getItem(sessionStorageKey);
    if (shouldClose) {
      document.body.innerHTML =
        "<p>U ben ingelogd. U kunt deze tab sluiten.</p>";
    }
  }
});

function onLinkClick(e: Event) {
  try {
    if (tryCreateNewTab()) {
      e.preventDefault();
    }
  } catch (error) {
    // popups are blocked, handle the link as usual.
  }
}
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
