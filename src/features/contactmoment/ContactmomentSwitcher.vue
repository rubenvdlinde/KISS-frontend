<template>
  <details ref="detailsEl" v-if="contactmomentStore.contactmomenten.length > 1">
    <summary class="utrecht-button">Contactmomenten</summary>
    <menu>
      <li v-for="(moment, idx) in moments" :key="idx">
        <button
          :disabled="moment.isCurrent"
          @click="moment.enable"
          :class="{ 'is-current': moment.isCurrent }"
        >
          <p v-if="moment.isCurrent" class="current-moment">
            Huidig contactmoment
          </p>
          <p class="name">
            {{ moment.description?.name || "Onbekende klant" }}
          </p>
          <p v-if="moment.description?.contact" class="contact">
            {{ moment.description.contact }}
          </p>
        </button>
      </li>
    </menu>
  </details>
</template>
<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import { onClickOutside } from "@vueuse/core";
import { computed, ref } from "vue";
import { getKlantInfo } from "./helpers";

const contactmomentStore = useContactmomentStore();
const moments = computed(() =>
  contactmomentStore.contactmomenten.map((x) => {
    return {
      description: getKlantInfo(x),
      isCurrent: x === contactmomentStore.huidigContactmoment,
      enable() {
        contactmomentStore.switchContactmoment(x);
      },
    };
  })
);

const detailsEl = ref();

onClickOutside(detailsEl, () => {
  const el = detailsEl.value;
  if (!(el instanceof HTMLElement)) return;
  el.removeAttribute("open");
});
</script>

<style lang="scss" scoped>
summary.utrecht-button {
  --utrecht-button-background-color: none;
  --utrecht-button-border-color: var(--color-white);
  border-style: solid;
  border-width: 2px;
  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
}

details {
  position: relative;
}

menu {
  position: absolute;
  margin-block-start: var(--spacing-small);
  padding-inline: var(--spacing-default);
  padding-block-end: var(--spacing-default);
  background: var(--color-white);
  inline-size: 100%;
  border-radius: var(--radius-default);

  li {
    border-block-end: 1px solid black;
    padding-block: var(--spacing-default);
  }

  button {
    all: unset;
    border-inline-start: 4px solid transparent;
    padding-inline-start: var(--spacing-small);

    &:not(:disabled):hover {
      cursor: pointer;
    }

    &.is-current {
      border-color: var(--color-accent);
    }
  }

  .current-moment {
    color: var(--color-accent);
    font-style: italic;
  }

  .name {
    font-weight: bold;
  }

  .contact,
  .current-moment {
    font-size: 0.875em;
  }
}
</style>
