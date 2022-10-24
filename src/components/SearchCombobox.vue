<template>
  <div
    ref="divRef"
    @keyup.down="nextIndex"
    @keyup.up="previousIndex"
    @keyup.enter="selectItem"
  >
    <input
      v-bind="$attrs"
      :id="inputId"
      :required="required"
      type="search"
      autocomplete="off"
      role="combobox"
      :aria-expanded="showList ? 'true' : 'false'"
      :aria-controls="listboxId"
      :aria-owns="listboxId"
      aria-autocomplete="list"
      aria-haspopup="listbox"
      @input="onInput"
      :value="modelValue"
      ref="inputRef"
    />
    <simple-spinner
      v-if="!matchingResult && listItems.loading"
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
        v-for="(r, i) in workingList"
        :key="i"
        @mouseover="handleHover(i)"
        @mousedown="selectItem"
        :class="{ active: i === activeIndex }"
        role="option"
      >
        <article>
          <header>{{ r.value }}</header>
          <p v-if="r.description">{{ r.description }}</p>
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
import { useFocusWithin } from "@vueuse/core";
import { ref, watch, type PropType } from "vue";
import { nanoid } from "nanoid";
import { focusNextFormItem } from "@/helpers/html";
import type { ServiceData } from "@/services";
import SimpleSpinner from "./SimpleSpinner.vue";

export type DatalistItem = {
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
  listItems: {
    type: Object as PropType<ServiceData<DatalistItem[]>>,
    required: true,
  },
  exactMatch: {
    type: Boolean,
    default: false,
  },
});

const generatedLabelId = nanoid();
const inputId = computed(() => props.id || generatedLabelId);
const labelId = nanoid();
const listboxId = nanoid();

const activeIndex = ref(0);

const workingList = ref<DatalistItem[]>([]);

function nextIndex() {
  if (
    showList.value &&
    activeIndex.value < workingList.value.length - 1 &&
    workingList.value.length
  ) {
    activeIndex.value += 1;
  } else {
    activeIndex.value = 0;
  }
  scrollIntoView();
}

function previousIndex() {
  if (!showList.value || !workingList.value.length) {
    activeIndex.value = 0;
  } else if (activeIndex.value > 0) {
    activeIndex.value -= 1;
  } else {
    activeIndex.value = workingList.value.length - 1;
  }
  scrollIntoView();
}

function selectItem() {
  if (!workingList.value.length) return;
  emit("update:modelValue", workingList.value[activeIndex.value].value);
  focusNextFormItem(inputRef.value);
}

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref();
const divRef = ref();

function onInput(e: Event) {
  if (!(e.currentTarget instanceof HTMLInputElement)) return;
  emit("update:modelValue", e.currentTarget.value);
}

const isScrolling = ref(false);

const hasFocus = useFocusWithin(divRef);

const showList = computed(
  () => workingList.value.length && hasFocus.focused.value
);

watch(workingList.value, (r) => {
  activeIndex.value = Math.max(0, Math.min(activeIndex.value, r.length - 1));
});

const matchingResult = computed(() => {
  if (workingList.value.some((x) => x.value === props.modelValue))
    return props.modelValue;
  return "";
});

const shouldSetValidity = computed(
  () =>
    (!matchingResult.value && !!props.modelValue) ||
    (!props.modelValue && props.required)
);

watch([inputRef, shouldSetValidity], ([r, s]) => {
  if (!(r instanceof HTMLInputElement)) return;
  r.setCustomValidity(s ? "Kies een optie uit de lijst" : "");
});

watch(
  props.listItems,
  (r) => {
    if (r.error) {
      workingList.value = [];
      return;
    }
    if (!r.success) return;
    activeIndex.value = Math.max(
      0,
      Math.min(activeIndex.value, r.data.length - 1)
    );
    workingList.value = r.data;
  },
  { immediate: true }
);

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function handleHover(i: number) {
  // ignore hover if we're scrolling, it's probably accidental
  if (isScrolling.value) return;
  activeIndex.value = i;
}

let timeoutId: number;

function scrollIntoView() {
  const el = divRef.value;
  if (!(el instanceof HTMLElement)) return;
  const matchingLi = el.getElementsByTagName("li").item(activeIndex.value);

  if (matchingLi && !isInViewport(matchingLi)) {
    // when we scroll, the cursor can accidentally end up on an item
    // in that case, we don't want that item to be selected, because we are navigating using the arrow keys.
    // so let's wait for a bit before allowing items to be selected on hover.
    isScrolling.value = true;
    matchingLi.scrollIntoView(false);
    timeoutId && clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      isScrolling.value = false;
    }, 500);
  }
}
</script>

<style lang="scss" scoped>
div .spinner {
  font-size: 0.875rem;
  color: black;
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
