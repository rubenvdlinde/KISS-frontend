<template>
  <div class="container">
    <application-message
      v-if="!huidigeKlant"
      messageType="warning"
      message="Er is geen klant geselecteerd"
    />

    <application-message
      v-if="
        huidigeKlant && !huidigeKlant.emails && !huidigeKlant.telefoonnummers
      "
      messageType="warning"
      message="Geselecteerde klant heeft geen telefoonnummer of e-mailadres"
    />

    <utrecht-heading model-value :level="2"
      >Contactverzoek maken</utrecht-heading
    >

    <medewerker-search
      class="utrecht-textbox utrecht-textbox--html-input"
      v-model="medewerker"
      :defaultValue="medewerker"
    >
      <template #label
        ><span class="utrecht-form-label"
          >Contactverzoek versturen naar</span
        ></template
      >
    </medewerker-search>

    <label class="utrecht-form-label notitieveld">
      <span class="required">Notitie bij het contactverzoek</span>
      <textarea
        v-model="notitie"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        rows="10"
      />
    </label>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import { useContactmomentStore, type Vraag } from "@/stores/contactmoment";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import MedewerkerSearch from "../search/MedewerkerSearch.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import type { Klant } from "../klant/types";
import { watch, ref, nextTick } from "vue";

const props = defineProps<{
  huidigeVraag: Vraag;
  huidigeKlant: Klant | undefined;
}>();

const contactmomentStore = useContactmomentStore();

watch(
  () => contactmomentStore?.huidigContactmoment?.huidigeVraag,
  (huidigeVraag) => {
    nextTick(() => {
      medewerker.value = huidigeVraag?.contactverzoek.medewerker ?? "";
      notitie.value = huidigeVraag?.contactverzoek.notitie ?? "";
    });
  },
  { deep: true }
);

const medewerker = ref(
  contactmomentStore?.huidigContactmoment?.huidigeVraag?.contactverzoek
    .medewerker ?? ""
);
const notitie = ref(
  contactmomentStore?.huidigContactmoment?.huidigeVraag?.contactverzoek
    .notitie ?? ""
);

watch(
  () => notitie.value,
  (notitie) => {
    contactmomentStore.updateContactverzoek({
      ...props.huidigeVraag.contactverzoek,
      notitie,
    });
  }
);

watch(
  () => medewerker.value,
  (medewerker) => {
    contactmomentStore.updateContactverzoek({
      ...props.huidigeVraag.contactverzoek,
      medewerker,
    });
  }
);
</script>

<style lang="scss" scoped>
.container > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}

textarea {
  resize: none;
}
</style>
