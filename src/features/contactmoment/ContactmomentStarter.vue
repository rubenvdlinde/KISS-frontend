<template>
  <utrecht-button
    model-value
    v-if="contactmoment.contactmomentLoopt"
    type="button"
    class="contactmomentLoopt"
    @click="onStopContactMoment"
    v-bind="$attrs"
  >
    Einde contactmoment
  </utrecht-button>

  <utrecht-button
    model-value
    v-else
    type="button"
    @click="onStartContactMoment"
    v-bind="$attrs"
  >
    Start contactmoment
  </utrecht-button>

  <modal-template v-if="beforeStopDialogRevealed">
    <template #message>
      <paragraph>
        {{ beforeStopWarning }}
      </paragraph>
    </template>

    <template #menu>
      <button
        modelValue
        @click="beforeStopDialog.cancel"
        class="utrecht-button utrecht-button--secondary-action"
      >
        Hier blijven
      </button>
      <button
        modelValue
        @click="beforeStopDialog.confirm"
        class="utrecht-button utrecht-button--action"
      >
        Doorgaan
      </button>
    </template>
  </modal-template>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useContactmomentStore } from "@/stores/contactmoment";
import { useRouter } from "vue-router";
import { useAttrs, defineProps, ref } from "vue";
import { useConfirmDialog } from "@vueuse/core";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ModalTemplate from "@/components/ModalTemplate.vue";

const props = defineProps<{
  beforeStopWarning: string;
}>();

const beforeStopDialogRevealed = ref(false);
const beforeStopDialog = useConfirmDialog(beforeStopDialogRevealed);
beforeStopDialog.onConfirm(() => stopContactMoment());

const attrs = useAttrs();

const router = useRouter();
const contactmoment = useContactmomentStore();

const onStartContactMoment = () => {
  if (attrs.disabled) return;
  contactmoment.start();
  router.push({ name: "contactmoment" });
};

const onStopContactMoment = () => {
  if (props.beforeStopWarning) {
    beforeStopDialog.reveal();
  } else {
    stopContactMoment();
  }
};

const stopContactMoment = () => {
  if (attrs.disabled) return;
  router.push({ name: "afhandeling" }); //een link zou wellicht toepasselijker zijn, maar de styling adhv het designsystem wordt lastig.
};
</script>

<style scoped lang="scss">
utrecht-button {
  position: fixed;
  bottom: var(--utrecht-space-row-4xl);
  right: var(--container-padding);
  --utrecht-button-min-block-size: 3.5rem;
  --utrecht-button-min-inline-size: 15rem;
}

utrecht-button.contactmomentLoopt {
  --utrecht-button-background-color: var(--color-accent);
}

menu {
  display: flex;
  gap: var(--spacing-default);
  justify-content: flex-end;
}
</style>
