<template>
  <label @click.stop>
    <input type="checkbox" @click.stop="koppel" :checked="selected" />
    <span>Opslaan bij contactmoment</span>
  </label>
</template>
<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import type { Zaak } from "./types";
import { computed } from "vue";

const props = defineProps<{ zaak: Zaak }>();

const contactmoment = useContactmomentStore();

const koppel = () => {
  contactmoment.toggleZaak(props.zaak);
};

const selected = computed(() => {
  return contactmoment.isZaakLinkedToContactmoment(props.zaak.id);
});
</script>

<style lang="scss" scoped>
input {
  accent-color: var(--color-primary);
  transform: scale(1.25);
  margin: 0;
  margin-inline-start: 2px;
}

label span {
  margin-left: var(--spacing-small);
}
</style>
