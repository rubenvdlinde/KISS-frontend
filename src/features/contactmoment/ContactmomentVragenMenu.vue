<template>
  <prompt-modal
    :dialog="dialog"
    message="Let op, je hebt het contactverzoek niet afgerond. Als je deze vraag verlaat, wordt het contactverzoek niet verstuurd."
  />
  <menu class="vragen-menu">
    <li>
      <button
        class="icon-after plus new-question"
        type="button"
        title="Nieuwe vraag"
        @click="startNieuweVraag"
      ></button>
    </li>
    <li v-for="(vraag, idx) in contactmomentStore.vragen" :key="idx">
      <button
        type="button"
        :disabled="vraag === contactmomentStore.huidigeVraag"
        :title="`Ga naar vraag ${idx + 1}`"
        @click="switchVraag(vraag)"
      >
        {{ idx + 1 }}
      </button>
    </li>
  </menu>
</template>
<script lang="ts" setup>
import { useContactmomentStore, type Vraag } from "@/stores/contactmoment";
import { useConfirmDialog } from "@vueuse/core";
import PromptModal from "@/components/PromptModal.vue";

const contactmomentStore = useContactmomentStore();
const dialog = useConfirmDialog();

async function startNieuweVraag() {
  if (contactmomentStore.wouldLoseProgress) {
    await waitForConfirmation();
  }
  contactmomentStore.startNieuweVraag();
}

async function switchVraag(vraag: Vraag) {
  if (contactmomentStore.wouldLoseProgress) {
    await waitForConfirmation();
  }
  contactmomentStore.switchVraag(vraag);
}

async function waitForConfirmation() {
  const { isCanceled } = await dialog.reveal();
  if (isCanceled) {
    throw new Error("canceled");
  }
}
</script>

<style lang="scss" scoped>
.vragen-menu {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(1.5rem, 1fr));
  gap: var(--spacing-small);
  padding: var(--spacing-small);

  button {
    all: unset;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: 100%;
    aspect-ratio: 1;
    border-radius: 50%;

    :hover {
      cursor: pointer;
    }

    &:disabled {
      background: var(--color-white);
      cursor: default;
    }
  }
}
</style>
