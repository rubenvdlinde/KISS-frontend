<template>
  <input
    v-bind="$attrs"
    type="search"
    placeholder="Zoek een medewerker"
    :list="modelValue ? undefined : datalistId"
    v-model="searchText"
    :title="modelValue"
    ref="inputRef"
  />
  <datalist :id="datalistId">
    <option v-for="(r, i) in mappedResult" :key="i" :value="r.emailadres">
      {{ r.omschrijving }}
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

const result = useGlobalSearch(searchParams);

const mappedResult = computed(() =>
  !result.success
    ? []
    : result.data.page.map((x) => {
        const { contact, department, function: functie } = x?.jsonObject ?? {};
        const { voornaam, voorvoegselAchternaam, achternaam, emailadres } =
          contact ?? {};
        const naam = [voornaam, voorvoegselAchternaam, achternaam]
          .filter(Boolean)
          .join(" ");
        const werk = [functie, department].filter(Boolean).join(" bij ");
        const omschrijving = [naam, werk].filter(Boolean).join(": ");
        return {
          emailadres,
          omschrijving,
        };
      })
);

const matchingResult = computed(() => {
  if (
    props.modelValue === searchText.value ||
    mappedResult.value.some((x) => x.emailadres === searchText.value)
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
  r.setCustomValidity(s ? "Kies een medewerker" : "");
});
</script>

<style lang="scss" scoped>
.spinner {
  font-size: 10px;
}
</style>
