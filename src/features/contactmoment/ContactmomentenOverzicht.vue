<template>
  <span>{{ contactmomenten }}</span>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import type { Contactmoment } from "./types";

defineProps({
  contactmomenten: {
    type: Array as PropType<Contactmoment[]>,
    required: true,
  },
});
</script>
