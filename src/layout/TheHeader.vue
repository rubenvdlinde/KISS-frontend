<template>
  <login-overlay>
    <template #default="{ onLogout }">
      <header
        :class="{ contactmomentLoopt: contactmomentStore.contactmomentLoopt }"
      >
        <global-search class="search-bar" v-if="route.meta.showSearch" />
        <a
          :href="logoutUrl"
          @click="onLogout"
          @keydown.enter="onLogout"
          class="log-out"
          >Uitloggen</a
        >
        <nav v-if="contactmomentStore.contactmomentLoopt && route.meta.showNav">
          <li>
            <router-link :to="{ name: 'home' }">Start</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'klanten' }">Klanten</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'zaken' }">Zaken</router-link>
          </li>
        </nav>
      </header>
    </template>
  </login-overlay>
</template>

<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import { useRoute } from "vue-router";
import { LoginOverlay, logoutUrl } from "../features/login";
import GlobalSearch from "../features/search/GlobalSearch.vue";

const route = useRoute();
const contactmomentStore = useContactmomentStore();
</script>

<style lang="scss" scoped>
header {
  background-color: var(--color-primary);
  display: grid;
  grid-template-areas:
    "bar logout"
    "results results"
    "expand expand"
    "nav nav";
  grid-template-columns: auto auto;
  align-items: center;

  .log-out {
    grid-area: logout;
    color: var(--color-white);
    padding: var(--spacing-small);
    margin-left: auto;
    margin-right: var(--container-padding);
  }
}

nav {
  width: 100%;
  background-color: var(--color-primary);
  display: flex;
  gap: var(--spacing-default);
  padding-block: var(--spacing-small);
  list-style: none;
  li {
    margin-inline: var(--spacing-large);
  }
  a {
    text-decoration: none;
    color: var(--color-white);
  }

  a.router-link-active {
    border-bottom: 2px solid var(--color-white);
  }
}

:deep(.search-bar) {
  margin-inline-start: var(--spacing-large);
}
</style>
