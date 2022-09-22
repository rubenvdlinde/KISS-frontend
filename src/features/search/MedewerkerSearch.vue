<template>
  <div
    ref="divRef"
    @keyup.down="nextIndex"
    @keyup.up="previousIndex"
    @keyup.enter="selectItem"
  >
    <label :id="labelId" :for="inputId" :class="{ required }">
      <slot name="label"></slot>
    </label>
    <input
      v-bind="$attrs"
      :id="inputId"
      :required="required"
      type="search"
      placeholder="Zoek een medewerker"
      autocomplete="off"
      role="combobox"
      :aria-expanded="showList ? 'true' : 'false'"
      :aria-controls="listboxId"
      :aria-owns="listboxId"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      v-model="searchText"
      ref="inputRef"
    />
    <SimpleSpinner
      v-if="!matchingResult && searchText && result.loading"
      class="spinner"
    />
    <ul
      v-if="showList"
      class="utrecht-textbox"
      role="listbox"
      :id="listboxId"
      :aria-labelledby="labelId"
    >
      <li
        v-for="(r, i) in listItems"
        :key="i"
        @mouseover="activeIndex = i"
        @mousedown="selectItem"
        :class="{ active: i === activeIndex }"
      >
        <article>
          <header>{{ r.value }}</header>
          <p>{{ r.description }}</p>
        </article>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { debouncedRef, useFocusWithin } from "@vueuse/core";
import { ref, watch } from "vue";
import { useGlobalSearch, useSources } from "./service";
import type { SearchResult } from "./types";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { nanoid } from "nanoid";
import { focusNextFormItem } from "@/helpers/html";

type DatalistItem = {
  value: string;
  description: string;
};

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: undefined,
  },
  required: {
    type: Boolean,
    default: false,
  },
});

const generatedLabelId = nanoid();
const inputId = computed(() => props.id || generatedLabelId);
const labelId = nanoid();
const listboxId = nanoid();

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

const activeIndex = ref(0);

function nextIndex() {
  if (
    showList.value &&
    activeIndex.value < listItems.value.length - 1 &&
    listItems.value.length
  ) {
    activeIndex.value += 1;
  } else {
    activeIndex.value = 0;
  }
}

function previousIndex() {
  if (!showList.value || !listItems.value.length) {
    activeIndex.value = 0;
  } else if (activeIndex.value > 0) {
    activeIndex.value -= 1;
  } else {
    activeIndex.value = listItems.value.length - 1;
  }
}

function selectItem() {
  if (!listItems.value.length) return;
  searchText.value = listItems.value[activeIndex.value].value;
  focusNextFormItem(inputRef.value);
}

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref();
const divRef = ref();

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

const hasFocus = useFocusWithin(divRef);

const showList = computed(
  () =>
    listItems.value.length &&
    hasFocus.focused.value &&
    (!props.modelValue || props.modelValue !== searchText.value)
);

const result = useGlobalSearch(searchParams);

const listItems = ref<DatalistItem[]>([]);

watch(searchText, (t) => {
  if (!t) {
    listItems.value = [];
  }
});

watch(result, (r) => {
  if (r.loading) return;
  if (r.error) {
    listItems.value = [];
    return;
  }
  activeIndex.value = Math.max(
    0,
    Math.min(activeIndex.value, r.data.page.length - 1)
  );
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
  () => !matchingResult.value && props.required
);

watch(matchingResult, (val) => {
  emit("update:modelValue", val);
});

watch(
  () => props.modelValue,
  (v) => {
    searchText.value = v;
  }
);

watch([inputRef, shouldSetValidity, searchText], ([r, s, v]) => {
  if (!(r instanceof HTMLInputElement)) return;
  r.setCustomValidity(
    s ? (!v ? "Zoek een medewerker" : "Kies een optie uit de lijst") : ""
  );
});
</script>

<style lang="scss" scoped>
.spinner {
  font-size: 0.875rem;
}
.spinner,
input,
ul {
  grid-column: 1;
  grid-row: 2;
}
div {
  position: relative;
  display: grid;
  gap: var(--spacing-small);
  align-items: center;
}
ul {
  position: absolute;
  border-radius: 0;
  display: grid;
  gap: var(--spacing-default);
  align-self: flex-end;
  transform: translateY(100%);
}
li {
  max-width: 100%;
  overflow-x: hidden;
}

li.active {
  background-color: var(--color-secondary);
  cursor: pointer;
}
article > p,
article > header {
  font-size: 0.875rem;
}
article > header {
  font-weight: bold;
}
</style>
