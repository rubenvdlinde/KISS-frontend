<template>
  <section>
    <utrecht-heading model-value :level="level">{{ header }}</utrecht-heading>
    <paragraph v-if="berichten.state === 'error'">{{
      onError(berichten.error)
    }}</paragraph>
    <template v-else-if="berichten.state === 'success'">
      <paragraph v-if="filter.search"
        >{{ berichten.data.page.length }}
        {{ berichten.data.page.length === 1 ? "resultaat" : "resultaten" }}
        gevonden</paragraph
      >
      <ul v-if="berichten.data.page.length">
        <li
          v-for="(werkInstructie, i) in berichten.data.page"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht
            :bericht="werkInstructie"
            :level="(level + 1 as any)"
            :show-type="!!filter.search"
          />
        </li>
      </ul>
      <pagination
        v-show="berichten.data.page.length"
        :pagination="berichten.data"
      />
    </template>
    <simple-spinner v-else></simple-spinner>
  </section>
</template>
<script lang="ts" setup>
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import { useWerkberichten, type WerkberichtParams } from "./service";
import WerkBericht from "./WerkBericht.vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { computed, type PropType } from "vue";
import Pagination from "../../nl-design-system/components/Pagination.vue";
import { useRoute } from "vue-router";

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
    type: Object as PropType<Pick<WerkberichtParams, "type" | "search">>,
    required: true,
  },
  onError: {
    type: Function as PropType<(e: Error) => string>,
    default: () => "Er ging iets mis. Probeer het later nog eens",
  },
});

const route = useRoute();
const currentPage = computed(() => {
  const pageQuery = route?.query?.page?.toString();
  if (!pageQuery) return undefined;
  const parsed = Number.parseInt(pageQuery, 10);
  if (!Number.isFinite(parsed)) return undefined;
  return parsed;
});

const wbParams = computed(() => ({
  ...props.filter,
  page: currentPage.value,
}));

const berichten = useWerkberichten(wbParams);
</script>

<style lang="scss" scoped>
section {
  display: grid;
  align-content: start;
  gap: 1rem;
}

ul + nav {
  justify-self: center;
}
</style>
