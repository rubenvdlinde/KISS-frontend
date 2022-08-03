<template>
  <main>
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>

    <router-link
      v-if="contactmomentStore.contactmomentLoopt"
      :to="{ name: 'contactmoment' }"
      >terug</router-link
    >

    <simple-spinner v-if="saving"></simple-spinner>

    <application-message
      v-else-if="errorMessage != ''"
      messageType="error"
      :message="errorMessage"
    ></application-message>

    <template v-else-if="contactmomentStore.contactmomentLoopt">
      <contactmoment-notitie
        class="notitie utrecht-textarea"
      ></contactmoment-notitie>

      <zaken-overzicht
        :zaken="contactmomentStore.zaken"
        v-if="contactmomentStore.zaken.length > 0"
      ></zaken-overzicht>

      <contactmoment-afhandel-form @save="saveContact" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { ContactmomentAfhandelForm } from "@/features/contactmoment";
import { useContactmomentStore } from "@/stores/contactmoment";
import ZakenOverzicht from "@/features/zaaksysteem/ZakenOverzicht.vue";
import { ref } from "vue";
import type { ContactmomentObject } from "@/features/zaaksysteem/types";
import { useZaaksysteemService } from "@/features/zaaksysteem/service";
import {
  useContactmomentService,
  ContactmomentNotitie,
} from "@/features/contactmoment";
import type { Contactmoment } from "@/features/contactmoment/types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { toast } from "@/stores/toast";
import { useRouter } from "vue-router";

const router = useRouter();
const contactmomentStore = useContactmomentStore();
const saving = ref(false);
const service = useZaaksysteemService();
const contactmomentService = useContactmomentService();
const errorMessage = ref("");

const zakenToevoegenAanContactmoment = (contactMomentUrl: string) => {
  const zaakSavePromises: Array<Promise<void>> = [];

  contactmomentStore?.zaken.forEach((zaak) => {
    const data = {
      contactmoment: contactMomentUrl,
      object: zaak.url,
      objectType: "zaak",
    } as ContactmomentObject;

    zaakSavePromises.push(
      service.saveZaak(data).catch(() => {
        errorMessage.value =
          "Er is een fout opgetreden bij het toevoegen van een zaak bij het contactmoment";
      })
    );
  });

  return Promise.all(zaakSavePromises);
};

const saveContact = (contactmoment: Contactmoment) => {
  saving.value = true;
  errorMessage.value = "";

  //de notitie wordt opgeslagen in het contactmoment ne niet als apart object
  enrichContactmomentWithNotitie(contactmoment);

  contactmomentService
    .save(contactmoment)
    .then((savedContactmoment) => {
      //zaken opslaan bij het contactmoment
      zakenToevoegenAanContactmoment(savedContactmoment.url).then(() => {
        contactmomentStore.stop();
        toast({ text: "Het contactmoment is opgeslagen" });
        router.push("/");
      });
    })
    .catch(() => {
      errorMessage.value =
        "Er is een fout opgetreden bij opslaan van het contactmoment";
    })
    .finally(() => {
      saving.value = false;
    });
};

const enrichContactmomentWithNotitie = (contactmoment: Contactmoment) => {
  contactmoment.tekst = contactmomentStore.notitie;
};
</script>

<style scoped lang="scss">
main {
  //center
  padding-inline: var(--container-padding);
  padding-block: var(--spacing-large);
  max-width: var(--section-width-large);
  margin-bottom: var(--spacing-large);

  //content stacked
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);
}

:deep(.notitie) {
  min-height: 10rem;
  width: 100%;
  padding: var(--spacing-default);
  box-sizing: border-box;
  margin-top: var(--spacing-default);
}
</style>
