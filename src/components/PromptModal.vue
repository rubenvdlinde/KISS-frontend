<template>
  <form
    @submit.prevent.stop="dialog.confirm"
    @keydown.escape="dialog.cancel"
    v-if="dialog.isRevealed.value"
  >
    <modal-template>
      <template #message>
        <paragraph>
          {{ message }}
        </paragraph>
      </template>
      <template #menu>
        <li>
          <button
            modelValue
            type="button"
            @click="dialog.cancel"
            class="utrecht-button utrecht-button--secondary-action"
          >
            {{ cancelMessage }}
          </button>
        </li>
        <li>
          <button
            type="submit"
            class="utrecht-button utrecht-button--action"
            v-focus
          >
            {{ confirmMessage }}
          </button>
        </li>
      </template>
    </modal-template>
  </form>
</template>

<script setup lang="ts">
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import type { UseConfirmDialogReturn } from "@vueuse/core";
import type { PropType } from "vue";
import ModalTemplate from "./ModalTemplate.vue";

type DialogFromLibrary = UseConfirmDialogReturn<unknown, unknown, unknown>;

defineProps({
  dialog: {
    type: Object as PropType<DialogFromLibrary>,
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
