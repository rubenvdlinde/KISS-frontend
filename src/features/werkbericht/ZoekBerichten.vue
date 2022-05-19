<template>
  <section>
    <utrecht-heading :level="2">Zoekresultaten</utrecht-heading>
    <paragraph v-if="filtered.state === 'error'">
      Er ging iets mis bij het zoeken.
    </paragraph>
    <template v-else-if="filtered.state === 'success'">
      <paragraph
        >{{ filtered.data.length }}
        {{ filtered.data.length === 1 ? "resultaat" : "resultaten" }}
        gevonden</paragraph
      >
      <ul v-if="filtered.data.length">
        <li
          v-for="(werkInstructie, i) in filtered.data"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht :bericht="werkInstructie" />
        </li>
      </ul>
      <div v-else>Waarom hier nog een keer?</div>
    </template>
    <simple-spinner v-else></simple-spinner>
  </section>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import { useFiltered, WerkBericht } from "@/features/werkbericht";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
const props = defineProps<{ type?: string; search: string }>();
const filter = computed(() => props);
const filtered = useFiltered(filter);
</script>
