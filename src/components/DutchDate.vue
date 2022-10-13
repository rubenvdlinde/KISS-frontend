<template>
  <time :datetime="date.toISOString().substring(0, 10)">{{
    formatDateOnly(date)
  }}</time>
</template>
<script setup lang="ts">
import { formatDateOnly } from "@/helpers/date";

defineProps<{ date: Date }>();
</script>
