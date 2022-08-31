<template>
  <form v-bind="$attrs" @submit.prevent="submit">
    <ModalTemplate v-if="isRevealed">
      <template #message>
        <ul class="errors">
          <li v-for="(message, i) in allMessages" :key="i">
            {{ message }}
          </li>
        </ul>
        <p>Wil je de gegevens toch opslaan?</p>
      </template>

      <template #menu>
        <utrecht-button
          modelValue
          @click="cancel"
          appearance="secondary-action-button"
          >Nee</utrecht-button
        >
        <utrecht-button modelValue @click="confirm">Ja</utrecht-button>
      </template>
    </ModalTemplate>
    <slot></slot>
  </form>
</template>
<script setup lang="ts">
import { useConfirmDialog } from "@vueuse/core";
import { provideValidationMessages } from "./useValidationMessages";
import ModalTemplate from "../ModalTemplate.vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import type { FormHTMLAttributes } from "vue";

defineProps<FormHTMLAttributes>();

const { isRevealed, reveal, confirm, cancel } = useConfirmDialog();

const allMessages = provideValidationMessages();

const emit = defineEmits(["submit"]);

function submit(e: Event) {
  if (allMessages.value.length) {
    reveal().then(({ isCanceled }) => {
      if (!isCanceled) {
        emit("submit", e);
      }
    });
  } else {
    emit("submit", e);
  }
}
</script>

<style lang="scss" scopde>
.errors {
  list-style: disc;
  margin-bottom: var(--spacing-small);
}
</style>
