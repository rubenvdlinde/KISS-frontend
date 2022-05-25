<template>
  <section>
    <utrecht-heading :level="level">{{ header }}</utrecht-heading>
    <paragraph v-if="berichten.state === 'error'">{{
      onError(berichten.error)
    }}</paragraph>
    <template v-else-if="berichten.state === 'success'">
      <paragraph v-if="filter.search"
        >{{ berichten.data.length }}
        {{ berichten.data.length === 1 ? "resultaat" : "resultaten" }}
        gevonden</paragraph
      >
      <ul v-if="berichten.data.length">
        <li
          v-for="(werkInstructie, i) in berichten.data"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht
            :bericht="werkInstructie"
            :level="(level + 1 as any)"
            :show-type="!!filter.search"
          />
        </li>
      </ul>
    </template>
    <simple-spinner v-else></simple-spinner>
  </section>
</template>
<script lang="ts" setup>
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import { useWerkberichten, WerkBericht } from "@/features/werkbericht";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import type { WerkberichtFilter } from "./types";
import { computed, type PropType } from "vue";
type HeadingLevel = 1 | 2 | 3 | 4 | 5;
const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  level: {
    type: Number as PropType<HeadingLevel>,
    default: 2,
  },
  filter: {
    type: Object as PropType<WerkberichtFilter>,
    required: true,
  },
  onError: {
    type: Function as PropType<(e: Error) => string>,
    default: () => "Er ging iets mis. Probeer het later nog eens",
  },
});
const berichten = useWerkberichten(computed(() => props.filter));
</script>
