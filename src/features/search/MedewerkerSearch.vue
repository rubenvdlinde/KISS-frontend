<template>
  <input
    v-bind="$attrs"
    type="search"
    placeholder="Zoek een medewerker"
    :list="showList ? datalistId : undefined"
    v-model="searchText"
    :title="modelValue"
    ref="inputRef"
  />
  <datalist v-if="showList" :id="datalistId">
    <option v-for="(r, i) in listItems" :key="i" :value="r.value">
      {{ r.description }}
    </option>
  </datalist>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { debouncedRef } from "@vueuse/core";
import { nanoid } from "nanoid";
import { ref, useAttrs, watch } from "vue";
import { useGlobalSearch, useSources } from "./service";
import type { SearchResult } from "./types";

type DatalistItem = {
  value: string;
  description: string;
};

function mapDatalistItem(x: SearchResult): DatalistItem {
  const { contact, department, function: functie } = x?.jsonObject ?? {};
  const { voornaam, voorvoegselAchternaam, achternaam, emailadres } =
    contact ?? {};
  const naam = [voornaam, voorvoegselAchternaam, achternaam]
    .filter(Boolean)
    .join(" ");
  const werk = [functie, department].filter(Boolean).join(" bij ");
  const description = [naam, werk].filter(Boolean).join(": ");
  return {
    value: emailadres,
    description,
  };
}

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue"]);
const attrs = useAttrs();

const datalistId = nanoid();
const inputRef = ref();
const searchText = ref("");
const debouncedSearchText = debouncedRef(searchText, 300);

const sources = useSources();

const searchParams = computed(() => {
  if (sources.success) {
    const smoelen = sources.data.find((x) => x.name === "Smoelenboek");
    if (smoelen) {
      return {
        filters: [smoelen],
        search: debouncedSearchText.value,
      };
    }
  }
  return {
    filters: [],
  };
});

const showList = computed(
  () => !props.modelValue || props.modelValue !== searchText.value
);

const result = useGlobalSearch(searchParams);

const listItems = ref<DatalistItem[]>([]);

watch(result, (r) => {
  if (r.loading) return;
  if (r.error) {
    listItems.value = [];
    return;
  }

  listItems.value = r.data.page.map(mapDatalistItem);
});

const matchingResult = computed(() => {
  if (
    props.modelValue === searchText.value ||
    listItems.value.some((x) => x.value === searchText.value)
  )
    return searchText.value;
  return "";
});

const shouldSetValidity = computed(
  () => !matchingResult.value && "required" in attrs
);

watch(matchingResult, (val) => {
  emit("update:modelValue", val);
});

watch([inputRef, shouldSetValidity], ([r, s]) => {
  if (!(r instanceof HTMLInputElement)) return;
  r.setCustomValidity(s ? "Kies een medewerker uit de lijst" : "");
});
</script>

<style lang="scss" scoped>
.spinner {
  font-size: 10px;
}

datalist span {
  display: absolute;
}
</style>
