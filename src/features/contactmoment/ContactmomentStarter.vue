<template>
  <utrecht-button
    model-value
    v-if="contactmomentStore.contactmomentLoopt"
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

  <prompt-modal
    :dialog="beforeStopDialog"
    message="Let op, je hebt het contactverzoek niet afgerond. Als je dit contactmoment afsluit, wordt het contactverzoek niet verstuurd."
  />
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
import { useAttrs } from "vue";
import { useConfirmDialog } from "@vueuse/core";
import PromptModal from "@/components/PromptModal.vue";

const beforeStopDialog = useConfirmDialog();

const attrs = useAttrs();

const router = useRouter();
const contactmomentStore = useContactmomentStore();

const onStartContactMoment = () => {
  if (attrs.disabled) return;
  contactmomentStore.start();
  router.push({ name: "klanten" });
};

const onStopContactMoment = async () => {
  if (attrs.disabled) return;
  if (contactmomentStore.wouldLoseProgress) {
    await waitForConfirmation();
  }
  router.push({ name: "afhandeling" }); //een link zou wellicht toepasselijker zijn, maar de styling adhv het designsystem wordt lastig.
};

async function waitForConfirmation() {
  const { isCanceled } = await beforeStopDialog.reveal();
  if (isCanceled) {
    throw new Error("canceled");
  }
}
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
