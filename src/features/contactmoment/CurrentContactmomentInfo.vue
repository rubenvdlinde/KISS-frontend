<template v-if="contactmomentStore.huidigContactmoment">
  <article>
    <prompt-modal
      :dialog="beforeStopDialog"
      message="Let op, je hebt het contactverzoek niet afgerond. Als je dit contactmoment afsluit, wordt het contactverzoek niet verstuurd."
    />
    <header>
      <h2>{{ klantInfo?.name || "onbekend" }}</h2>
      <p v-if="klantInfo?.contact">{{ klantInfo.contact }}</p>
    </header>
    <utrecht-button model-value @click="onStopContactMoment" v-bind="$attrs">
      Einde
    </utrecht-button>
  </article>
</template>

<script setup lang="ts">
import { useContactmomentStore } from "@/stores/contactmoment";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import { useConfirmDialog } from "@vueuse/core";
import { computed, useAttrs } from "vue";
import { useRouter } from "vue-router";
import PromptModal from "@/components/PromptModal.vue";
import { getKlantInfo } from "./helpers";

const beforeStopDialog = useConfirmDialog();

const attrs = useAttrs();

const router = useRouter();
const contactmomentStore = useContactmomentStore();

const klantInfo = computed(() =>
  contactmomentStore.huidigContactmoment
    ? getKlantInfo(contactmomentStore.huidigContactmoment)
    : undefined
);

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

<style lang="scss" scoped>
article {
  padding-inline: var(--spacing-default);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-small);

  utrecht-button {
    --utrecht-button-background-color: var(--color-error);
    --utrecht-button-min-inline-size: 12ch;
  }

  h2 {
    margin-block-start: 0;
  }
}
</style>
