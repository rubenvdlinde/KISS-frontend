<template>
  <label>
    <input type="checkbox" @change="koppel" v-model="selected" />
    <span>Opslaan bij contactmoment</span>
  </label>
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
  selected.value = contactmoment.isZaakLinkedToContactmoment(props.zaak.id);
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
