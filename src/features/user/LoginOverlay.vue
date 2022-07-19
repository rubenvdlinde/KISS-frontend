<template>
  <SimpleSpinner v-if="loggedIn.loading" />
  <template v-else>
    <slot v-if="initialized"></slot>
    <dialog ref="dialog" @keyup.escape.prevent @keydown.escape.prevent>
      <a :href="redirectUrl" target="_blank" @click="onLinkClick"> Inloggen </a>
    </dialog>
  </template>
</template>

<script lang="ts" setup>
import { watch, computed, ref, watchEffect } from "vue";
import { loginUrl, useCurrentUser } from "./service";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { handleLogin } from "@/services/wait-for-login";

const channel = new BroadcastChannel(
  "kiss-close-tab-channel-" + window.location.host
);

const redirectUrl = "/redirect-to-login";

let newTab: Window | null = null;

channel.onmessage = () => {
  shouldShowLogin.value = false;
  if (newTab && !newTab.closed) {
    newTab.close();
    newTab = null;
  }
};

const dialog = ref<HTMLDialogElement>();

const loggedIn = useCurrentUser();

const shouldShowLogin = ref(true);

const initialized = ref(false);

watchEffect(() => {
  shouldShowLogin.value = !loggedIn.success || !loggedIn.data.isLoggedIn;
});

const isLoggedIn = computed(() => loggedIn.success && loggedIn.data.isLoggedIn);

const dispose = watch(isLoggedIn, (x) => {
  if (x) {
    initialized.value = true;
  } else {
    window.location.href = loginUrl;
  }
  dispose();
});

watch([shouldShowLogin, dialog], ([x, d]) => {
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
    const shouldClose = sessionStorage.getItem("kiss_close") === "true";
    if (shouldClose) {
      document.body.innerHTML =
        "<p>U ben ingelogd. U kunt deze tab sluiten.</p>";
    }
  }
});

const onLinkClick = (e: Event) => {
  try {
    if (newTab && !newTab.closed) {
      newTab.focus();
      e.preventDefault();
      return;
    }
    newTab = window.open(redirectUrl);
    if (newTab) {
      e.preventDefault();
    }
  } catch (error) {
    // popups are blocked, handle the link as usual.
  }
};
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
