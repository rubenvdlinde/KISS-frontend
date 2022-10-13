<template>
  <time v-if="date" :datetime="date.toISOString().substring(0, 10)">{{
    formatDateOnly(date)
  }}</time>
  <span v-else>Onbekend</span>
</template>
<script setup lang="ts">
import { formatDateOnly } from "@/helpers/date";

defineProps<{ date: Date | undefined }>();
</script>
