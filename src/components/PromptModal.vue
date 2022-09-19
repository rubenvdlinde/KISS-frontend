<template>
  <modal-template v-if="dialog.isRevealed.value">
    <template #message>
      <paragraph>
        {{ message }}
      </paragraph>
    </template>

    <template #menu>
      <li>
        <button
          modelValue
          @click="dialog.cancel"
          class="utrecht-button utrecht-button--secondary-action"
        >
          {{ cancelMessage }}
        </button>
      </li>
      <li>
        <button
          modelValue
          @click="dialog.confirm"
          class="utrecht-button utrecht-button--action"
        >
          {{ confirmMessage }}
        </button>
      </li>
    </template>
  </modal-template>
</template>

<script setup lang="ts">
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import type { ComputedRef, PropType } from "vue";
import ModalTemplate from "./ModalTemplate.vue";
defineProps({
  dialog: {
    type: Object as PropType<{
      isRevealed: ComputedRef<boolean>;
      confirm: () => void;
      cancel: () => void;
    }>,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  cancelMessage: {
    type: String,
    default: "Hier blijven",
  },
  confirmMessage: {
    type: String,
    default: "Doorgaan",
  },
});
</script>
