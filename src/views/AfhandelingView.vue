<template>
  <main>
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>
    <router-link
      v-if="contactmomentStore.contactmomentLoopt"
      :to="{ name: 'contactmoment' }"
      >terug</router-link
    >
    <div>
      <section v-if="saving"><simple-spinner></simple-spinner></section>
      <application-message
        v-else-if="errorMessage != ''"
        messageType="error"
        :message="errorMessage"
      ></application-message>

      <template v-else-if="contactmomentStore.contactmomentLoopt">
        <section>
          <contactmoment-notitie class="notitie"></contactmoment-notitie>
        </section>
        <section v-if="contactmomentStore.zaken.length > 0">
          <zaken-overzicht :zaken="contactmomentStore.zaken"></zaken-overzicht>
        </section>
        <section>
          <contactmoment-afhandel-form @save="saveContact" />
        </section>
      </template>
    </div>
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
import { toast } from "@/stores/toast";
import { useRouter } from "vue-router";
import ContactmomentNotitie from "@/features/notitie/ContactmomentNotitie.vue";

const router = useRouter();
const contactmomentStore = useContactmomentStore();
const saving = ref(false);
const service = useZaaksysteemService();
const contactmomentService = useContactmomentService();
const errorMessage = ref("");

const zakenToevoegenAanContactmoment = (contactMomentUrl: string) => {
  contactmomentStore?.zaken.forEach((zaak) => {
    const data = {
      contactmoment: contactMomentUrl,
      object: zaak.url,
      objectType: "zaak",
    } as ContactmomentObject;

    service.saveZaak(data).catch(() => {
      errorMessage.value =
        "Er is een fout opgetreden bij het toevoegen van een zaak bij het contactmoment";
    });
  });

  //klaar
  contactmomentStore.stop();
};

const saveContact = (contactmoment: Contactmoment) => {
  saving.value = true;

  errorMessage.value = "";

  contactmomentService
    .save(contactmoment)
    .then((savedContactmoment) => {
      // nu ook de zaken opslaan bij het contactmoment
      zakenToevoegenAanContactmoment(savedContactmoment.url);

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
main {
  //center
  padding-inline: var(--container-padding);
  padding-block: var(--spacing-large);

  //

  display: flex;
  flex-direction: column;
  // flex-flow: row wrap;
  gap: var(--spacing-default);
  // justify-content: space-between;
  //position: relative;

  // > * {
  //   flex-basis: 100%;
  // }
}

//main > section {
// &:not(:only-of-type) {
//   max-width: var(--section-width);
// }

// > utrecht-heading:first-child {
//   padding-left: var(--text-margin);
//   padding-bottom: 0.5rem;
//   border-bottom: 1px solid var(--color-tertiary);
// }
//}

section {
  max-width: var(--section-width-large);
  margin-bottom: var(--spacing-large);
}

section.notitie {
  min-height: 20rem;
}
</style>
