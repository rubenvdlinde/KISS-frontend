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
        <section
          v-if="contactmomentStore.klanten.length"
          class="gerelateerde-klanten"
        >
          <utrecht-heading :level="2" model-value>{{
            contactmomentStore.klanten.length > 1
              ? "Gerelateerde klanten"
              : "Gerelateerde klant"
          }}</utrecht-heading>
          <ul>
            <li
              v-for="record in contactmomentStore.klanten"
              :key="record.klant.id"
            >
              <label>
                <span>{{
                  [
                    record.klant.voornaam,
                    record.klant.voorvoegselAchternaam,
                    record.klant.achternaam,
                  ]
                    .filter((x) => x)
                    .join(" ")
                }}</span>
                <input type="checkbox" v-model="record.shouldStore" />
              </label>
            </li>
          </ul>
        </section>
        <section v-if="contactmomentStore.zaken.length > 0">
          <utrecht-heading :level="2" model-value>{{
            contactmomentStore.zaken.length > 1
              ? "Gerelateerde zaken"
              : "Gerelateerde zaak"
          }}</utrecht-heading>
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
import {
  ContactmomentAfhandelForm,
  koppelKlant,
} from "@/features/contactmoment";
import { useContactmomentStore } from "@/stores/contactmoment";
import ZakenOverzicht from "@/features/zaaksysteem/ZakenOverzicht.vue";
import { ref } from "vue";
import { useZaaksysteemService } from "@/features/zaaksysteem/service";
import { useContactmomentService } from "@/features/contactmoment";
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
  const promises = contactmomentStore?.zaken.map((zaak) =>
    service.saveZaak({
      contactmoment: contactMomentUrl,
      object: zaak.url,
      objectType: "zaak",
    })
  );
  return Promise.all(promises);
};

const koppelKlanten = (contactmomentId: string) => {
  const promises = contactmomentStore.klanten
    .filter((x) => x.shouldStore)
    .map((x) =>
      koppelKlant({
        contactmomentId,
        klantId: x.klant.id,
      })
    );
  return Promise.all(promises);
};

const saveContact = (contactmoment: Contactmoment) => {
  saving.value = true;

  errorMessage.value = "";

  contactmomentService
    .save(contactmoment)
    .then((savedContactmoment) =>
      Promise.all([
        zakenToevoegenAanContactmoment(savedContactmoment.url),
        koppelKlanten(savedContactmoment.id),
      ])
    )
    .then(() => {
      //klaar
      contactmomentStore.stop();
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

.gerelateerde-klanten {
  li > label {
    display: grid;
    grid-auto-flow: column;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-default);
    width: 20rem;
    padding-block: var(--spacing-small);

    &:hover {
      cursor: pointer;
    }

    input[type="checkbox"] {
      transform: scale(1.25);
      accent-color: var(--color-primary);
    }
  }
}
</style>
