<template>
  <dialog ref="dialogRef" @close="onClose">
    <form method="dialog">
      <paragraph>
        {{ message }}
      </paragraph>
      <menu>
        <li>
          <button
            modelValue
            value="cancel"
            class="utrecht-button utrecht-button--secondary-action"
          >
            {{ cancelMessage }}
          </button>
        </li>
        <li>
          <button
            value="confirm"
            class="utrecht-button utrecht-button--action"
            v-focus
          >
            {{ confirmMessage }}
          </button>
        </li>
      </menu>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import { whenever, type UseConfirmDialogReturn } from "@vueuse/core";
import { ref, type PropType } from "vue";

type DialogFromLibrary = UseConfirmDialogReturn<unknown, unknown, unknown>;

const props = defineProps({
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

const dialogRef = ref<HTMLDialogElement>();

const onClose = () => {
  if (dialogRef.value?.returnValue === "confirm") {
    props.dialog.confirm();
  } else {
    props.dialog.cancel();
  }
};

whenever(
  () => props.dialog.isRevealed.value,
  () => {
    dialogRef.value?.showModal();
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
menu {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
dialog {
  border-radius: var(--radius-default);
  padding: 2rem;
  border: 1px solid var(--color-primary);
}
::backdrop {
  background-color: rgba(102, 102, 102, 0.8);
}
</style>
