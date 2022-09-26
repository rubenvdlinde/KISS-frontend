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
      <span v-if="vraag === contactmomentStore.huidigeVraag">
        {{ idx + 1 }}
      </span>
      <button
        v-else
        type="button"
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
  gap: var(--spacing-default);
  padding: var(--spacing-small);

  button:hover {
    cursor: pointer;
  }

  li {
    display: flex;
    align-items: stretch;
    aspect-ratio: 1;
    font-weight: bold;
  }

  button,
  span {
    display: flex;
    background: none;
    padding: 0;
    margin: 0;
    border: none;
    align-items: center;
    justify-content: center;
    width: 100%;
    font: inherit;
    border-radius: 100%;
    height: unset;
    color: inherit;
  }

  span {
    background: var(--color-white);
  }
}
</style>
