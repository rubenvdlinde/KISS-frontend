<template>
  <SimpleDialog
    :dialog="dialog"
    message="Let op, je hebt het contactverzoek niet afgerond. Als je deze vraag verlaat, wordt het contactverzoek niet verstuurd."
  />
  <menu class="vragen-menu">
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
    <li>
      <button
        class="icon-after plus new-question"
        type="button"
        title="Nieuwe vraag"
        @click="startNieuweVraag"
      ></button>
    </li>
  </menu>
</template>
<script lang="ts" setup>
import { useContactmomentStore, type Vraag } from "@/stores/contactmoment";
import { useConfirmDialog } from "@vueuse/core";
import SimpleDialog from "../../components/SimpleDialog.vue";

const contactmomentStore = useContactmomentStore();
const dialog = useConfirmDialog();

async function startNieuweVraag() {
  if (await validateContactverzoek()) {
    contactmomentStore.startNieuweVraag();
  }
}

async function switchVraag(vraag: Vraag) {
  if (await validateContactverzoek()) {
    contactmomentStore.huidigeVraag = vraag;
  }
}

async function validateContactverzoek() {
  if (!contactmomentStore.huidigeVraag.contactverzoek.isDirty) return true;
  const { isCanceled } = await dialog.reveal();
  return !isCanceled;
}
</script>
