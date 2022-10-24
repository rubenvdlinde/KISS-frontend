<template>
  <div class="container">
    <application-message
      v-if="!huidigeKlant"
      messageType="warning"
      message="Er is geen klant geselecteerd"
    />

    <application-message
      v-if="
        huidigeKlant &&
        !huidigeKlant.emails.length &&
        !huidigeKlant.telefoonnummers.length
      "
      messageType="warning"
      message="Geselecteerde klant heeft geen telefoonnummer of e-mailadres"
    />

    <utrecht-heading model-value :level="2"
      >Contactverzoek maken</utrecht-heading
    >

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
import MedewerkerSearch from "@/features/search/MedewerkerSearch.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import type { Klant } from "@/features/klant/";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  huidigeVraag: Vraag;
  huidigeKlant: Klant | undefined;
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
