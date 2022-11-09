<template>
  <form class="container" @submit.prevent>
    <application-message
      v-if="!huidigeKlant"
      messageType="warning"
      message="Er is geen klant geselecteerd"
    />

    <application-message
      v-if="huidigeKlant && !huidigeKlant.hasContactInformation"
      messageType="warning"
      message="Geselecteerde klant heeft geen telefoonnummer of e-mailadres"
    />

    <utrecht-heading :level="2">Contactverzoek maken</utrecht-heading>

    <label class="utrecht-form-label required" for="medewerker-select"
      >Contactverzoek versturen naar</label
    >
    <medewerker-search
      class="utrecht-textbox utrecht-textbox--html-input"
      id="medewerker-select"
      v-model="medewerker"
      :defaultValue="medewerker"
    />

    <label class="utrecht-form-label notitieveld">
      <span class="required">Notitie bij het contactverzoek</span>
      <textarea
        v-model="notitie"
        class="utrecht-textarea utrecht-textarea--html-textarea"
        rows="10"
      />
    </label>
  </form>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script lang="ts" setup>
import {
  useContactmomentStore,
  type ContactmomentKlant,
  type Vraag,
} from "@/stores/contactmoment";
import { Heading as UtrechtHeading } from "@utrecht/component-library-vue";
import MedewerkerSearch from "@/features/search/MedewerkerSearch.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  huidigeVraag: Vraag;
  huidigeKlant: ContactmomentKlant | undefined;
}>();

const contactmomentStore = useContactmomentStore();

const medewerker = computed({
  get: () => props.huidigeVraag.contactverzoek.medewerker,
  set(medewerker) {
    if (!medewerker) return;

    contactmomentStore.updateContactverzoek({
      ...props.huidigeVraag.contactverzoek,
      medewerker,
    });
  },
});

const notitie = computed({
  get: () => props.huidigeVraag.contactverzoek.notitie,
  set: (notitie) => {
    if (!notitie) return;

    contactmomentStore.updateContactverzoek({
      ...props.huidigeVraag.contactverzoek,
      notitie,
    });
  },
});
</script>

<style lang="scss" scoped>
.container > *:not(:last-child) {
  margin-block-end: var(--spacing-large);
}

textarea {
  resize: none;
}
</style>
