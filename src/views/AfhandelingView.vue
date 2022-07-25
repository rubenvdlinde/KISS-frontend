<template>
  <main>
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>
    <router-link
      v-if="contactmoment.contactmomentLoopt"
      :to="{ name: 'contactmoment' }"
      >terug</router-link
    >
    <section>
      <section v-if="saving"><simple-spinner></simple-spinner></section>
      <application-message
        v-else-if="errorMessage != ''"
        messageType="error"
        :message="errorMessage"
      ></application-message>

      <template v-else-if="contactmoment.contactmomentLoopt">
        <section v-if="contactmoment.zaken.length > 0">
          <zaken-overzicht :zaken="contactmoment.zaken"></zaken-overzicht>
        </section>
        <section>
          <contactmoment-afhandel-form @save="saveContact" />
        </section>
      </template>
    </section>
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
import { useContactmomentService } from "@/features/contactmoment";
import type { Contactmoment } from "@/features/contactmoment/types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { useToast } from "@/stores/toast";
import { useRouter } from "vue-router";

const { toast } = useToast();
const router = useRouter();
const contactmoment = useContactmomentStore();
const saving = ref(false);
const service = useZaaksysteemService();
const contactmomentService = useContactmomentService();
const errorMessage = ref("");

const zakenToevoegenAanContactmoment = (id: string) => {
  contactmoment?.zaken.forEach((zaak) => {
    const data = {
      contactmoment: window.gatewayBaseUri + "/api/objectcontactmomenten/" + id, //todo de hele url zou uit de response van het aanmaken contactmoment moeten komen
      object: zaak.url,
      objectType: "zaak",
    } as ContactmomentObject;

    service.saveZaak(data).catch(() => {
      errorMessage.value =
        "Er is een fout opgetreden bij het toevoegen van een zaak bij het contactmoment";
    });
  });

  //klaar
  contactmoment.stop();
};

const saveContact = (contactmoment: Contactmoment) => {
  saving.value = true;

  errorMessage.value = "";

  contactmomentService
    .save(contactmoment)
    .then((savedContactmoment) => {
      // nu ook de zaken opslaan bij het contactmoment
      zakenToevoegenAanContactmoment(savedContactmoment.id);
      toast({ text: "Het contactmoment is opgeslagen" });
      router.push("/");
    })
    .catch(() => {
      errorMessage.value =
        "Er is een fout opgetreden bij opslaan van het contactmoment";
    })
    .finally(() => {
      saving.value = false;
    });
};
</script>

<style scoped lang="scss">
section {
  max-width: var(--section-width-large);
  margin-bottom: var(--spacing-large);
}
</style>
