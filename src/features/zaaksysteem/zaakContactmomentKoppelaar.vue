<template>
  <button
    @click="koppel"
    class="icon-button icon-after icon-large check"
    :class="{ selected: selected }"
  ></button>
</template>
<script lang="ts" setup>
import { useContactmomentStore } from "@/stores/contactmoment";
import type { Zaak } from "@/features/zaaksysteem/types";
import { ref, onMounted, type PropType } from "vue";

const props = defineProps({
  zaak: { type: Object as PropType<Zaak>, default: null },
});

const contactmoment = useContactmomentStore();
const selected = ref(false);

const koppel = () => {
  selected.value = contactmoment.toggleZaak(props.zaak);
};

onMounted(() => {
  const stored = contactmoment.findById(props.zaak.id);

  selected.value = stored ? stored.shouldStore : false;
});

// const isZaakSelected = computed(() => {
//   const stored = contactmoment.findById(props.zaak.id);

//   return stored ? stored.shouldStore : false;
// });
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
