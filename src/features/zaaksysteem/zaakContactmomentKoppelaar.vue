<template>
  <button
    @click="koppel"
    class="icon-button icon-after icon-large check"
    :class="{ selected: isZaakSelected() }"
  ></button>
</template>
<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import type { Zaak } from "@/features/zaaksysteem/types";
import type { PropType } from "vue";

const props = defineProps({
  zaak: { type: Object as PropType<Zaak>, default: null },
});

const contactmoment = useContactmomentStore();

const koppel = () => {
  contactmoment.toggleZaak(props.zaak);
};

const isZaakSelected = () => {
  const stored = contactmoment.findById(props.zaak.id);

  return stored ? stored.shouldStore : false;
};
</script>

<style lang="scss" scoped>
.icon-button {
  color: var(--color-tertiary);
  border: none;
  background-color: transparent;
}
.selected {
  color: var(--color-accent);
}
</style>
