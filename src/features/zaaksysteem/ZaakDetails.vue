<template>
  <section>
    <div class="header">
      <utrecht-heading :level="1" model-value
        >Zaak {{ zaak.identificatie }}
      </utrecht-heading>
      <router-link :to="{ name: 'zaken' }">{{ "< Ga terug" }}</router-link>
    </div>

    <div class="toelichting">
      <zaak-toelichting :zaak="zaak" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import ZaakToelichting from "./components/ZaakToelichting.vue";

defineProps<{
  zaak: ZaakDetails;
}>();
</script>

<style scoped lang="scss">
section > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}
.notes {
  gap: var(--spacing-large);
  display: flex;

  .current-notes {
    flex: 3;
  }

  .new-note {
    flex: 2;
  }
}

.new-note {
  > *:not(:last-child) {
    margin-block-end: var(--spacing-small);
  }

  menu {
    display: flex;
    gap: var(--spacing-small);
    float: right;
  }
}

.toelichting-heading {
  display: flex;

  button {
    all: unset;
    margin-inline-start: var(--spacing-default);

    &:hover {
      cursor: pointer;
    }
  }
}

.spinner {
  font-size: 16px;
  margin-inline-start: var(--spacing-default);
}
</style>
