<template>
  <section>
    <utrecht-heading model-value :level="level">{{ header }}</utrecht-heading>

    <paragraph v-if="berichten.state === 'error'">{{
      getErrorMessage(berichten.error)
    }}</paragraph>

    <template v-else-if="berichten.state === 'success'">
      <paragraph v-if="search || skillIds?.length"
        >{{ berichten.data.totalRecords }}
        {{ berichten.data.totalRecords === 1 ? "resultaat" : "resultaten" }}
        gevonden</paragraph
      >
      <ul v-if="berichten.data.page.length" ref="listEl">
        <li
          v-for="(werkInstructie, i) in berichten.data.page"
          :key="`werkinstructies_${i}`"
        >
          <werk-bericht
            :bericht="werkInstructie"
            :level="(level + 1 as any)"
            :show-type="!!search || !!skillIds?.length"
          />
        </li>
      </ul>
      <pagination
        v-show="berichten.data.page.length"
        :pagination="berichten.data"
        @navigate="onNavigate"
      />
    </template>

    <simple-spinner v-else></simple-spinner>
  </section>
</template>

<script lang="ts" setup>
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { computed, ref, watch, type PropType } from "vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import Pagination from "@/nl-design-system/components/Pagination.vue";
import { useWerkberichten } from "./service";
import WerkBericht from "./WerkBericht.vue";

const props = defineProps({
  header: {
    type: String,
    required: true,
  },
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 2,
  },
  search: {
    type: String,
    default: "",
  },
  typeId: {
    type: Number,
    default: undefined,
  },
  skillIds: {
    type: Array as PropType<number[]>,
    default: () => [],
  },
  getErrorMessage: {
    type: Function as PropType<(e: Error) => string>,
    default: () => "Er ging iets mis. Probeer het later nog eens",
  },
  pageParamName: {
    type: String,
    default: "page",
  },
});

const currentPage = ref(1);
const listEl = ref<Element>();

const onNavigate = (pageNum: number) => {
  currentPage.value = pageNum;
  const list = listEl.value;
  if (list) {
    list.scrollIntoView();
  }
};

const parameters = computed(() => ({
  search: props.search,
  skillIds: props.skillIds,
  typeId: props.typeId,
  page: currentPage.value,
}));

const berichten = useWerkberichten(parameters);

watch([() => props.search, () => props.skillIds, () => props.typeId], () => {
  currentPage.value = 1;
});
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

section > ul {
  display: grid;
  grid-template-columns: repeat(auto-fill, min(var(--section-width), 100%));
  justify-content: space-between;
  gap: 1.5rem;
}

section > p {
  margin-inline-start: var(--text-margin);
}
</style>
