<template>
  <main>
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>

    <router-link
      v-if="contactmomentStore.contactmomentLoopt"
      :to="{ name: 'contactmoment' }"
    >
      terug
    </router-link>

    <simple-spinner v-if="saving" />

    <application-message
      v-else-if="errorMessage != ''"
      messageType="error"
      :message="errorMessage"
    />

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
        <utrecht-heading :level="2" model-value>
          {{
            contactmomentStore.zaken.length > 1
              ? "Gerelateerde zaken"
              : "Gerelateerde zaak"
          }}
        </utrecht-heading>
        <zaken-overzicht :zaken="contactmomentStore.zaken" />
      </section>

      <section>
        <contactmoment-notitie class="notitie utrecht-textarea" />
      </section>

      <contactmoment-afhandel-form @save="saveContact" />
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";

import {
  useContactmomentStore,
  type Contactmoment,
} from "@/stores/contactmoment";
import { toast } from "@/stores/toast";

import {
  ContactmomentAfhandelForm,
  koppelKlant,
  useContactmomentService,
  ContactmomentNotitie,
  koppelObject,
} from "@/features/contactmoment";
import { ZakenOverzicht } from "@/features/zaaksysteem";

const router = useRouter();
const contactmomentStore = useContactmomentStore();
const saving = ref(false);
const contactmomentService = useContactmomentService();
const errorMessage = ref("");

const zakenToevoegenAanContactmoment = (contactmomentId: string) => {
  const promises = contactmomentStore?.zaken.map((zaak) =>
    koppelObject({
      contactmoment: contactmomentId,
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

const koppelContactverzoek = (
  contacmomentId: string,
  contactverzoekUrl: string
) =>
  koppelObject({
    contactmoment: contacmomentId,
    object: contactverzoekUrl,
    objectType: "contactmomentobject",
  });

const saveContact = (contactmoment: Contactmoment) => {
  saving.value = true;
  errorMessage.value = "";

  //de notitie wordt opgeslagen in het contactmoment ne niet als apart object
  enrichContactmomentWithNotitie(contactmoment);
  enrichContactmomentWithStartdatum(contactmoment);

  return contactmomentService
    .save(contactmoment)
    .then((savedContactmoment) => {
      const nextPromises: Promise<unknown>[] = [
        zakenToevoegenAanContactmoment(savedContactmoment.id),
        koppelKlanten(savedContactmoment.id),
      ];
      if (contactmomentStore.contactverzoek) {
        nextPromises.push(
          koppelContactverzoek(
            savedContactmoment.id,
            contactmomentStore.contactverzoek.url
          )
        );
      }
      return Promise.all(nextPromises);
    })
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

const enrichContactmomentWithNotitie = (contactmoment: Contactmoment) => {
  contactmoment.tekst = contactmomentStore.notitie;
};

const enrichContactmomentWithStartdatum = (contactmoment: Contactmoment) => {
  contactmoment.startdatum = contactmomentStore.startdatum;
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
