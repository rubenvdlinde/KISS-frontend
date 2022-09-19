<template>
  <simple-spinner v-if="saving" />
  <div class="afhandeling" v-else>
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>

    <a @click="$router.back()" href="#"> terug </a>

    <application-message
      v-if="errorMessage != ''"
      messageType="error"
      :message="errorMessage"
    />

    <template v-else-if="contactmomentStore.contactmomentLoopt">
      <section
        v-if="contactmomentStore.klanten.length"
        class="gerelateerde-resources"
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
              <span v-if="record.klant.voornaam || record.klant.achternaam">{{
                [
                  record.klant.voornaam,
                  record.klant.voorvoegselAchternaam,
                  record.klant.achternaam,
                ]
                  .filter((x) => x)
                  .join(" ")
              }}</span>
              <span v-else>{{
                [
                  record.klant.emails[0].email,
                  record.klant.telefoonnummers[0].telefoonnummer,
                ]
                  .filter((x) => x)
                  .join(", ")
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

      <section
        v-if="contactmomentStore.medewerkers.length"
        class="gerelateerde-resources"
      >
        <utrecht-heading :level="2" model-value>{{
          contactmomentStore.medewerkers.length > 1
            ? "Gerelateerde medewerkers"
            : "Gerelateerde medewerker"
        }}</utrecht-heading>
        <ul>
          <li
            v-for="medewerker in contactmomentStore.medewerkers"
            :key="medewerker.id"
          >
            <label>
              <span v-if="medewerker.voornaam || medewerker.achternaam"
                >{{
                  [
                    medewerker.voornaam,
                    medewerker.voorvoegselAchternaam,
                    medewerker.achternaam,
                  ]
                    .filter((x) => x)
                    .join(" ")
                }}
                ({{ medewerker.emailadres }})</span
              >
              <input type="checkbox" v-model="medewerker.shouldStore" />
            </label>
          </li>
        </ul>
      </section>

      <section>
        <contactmoment-notitie class="notitie utrecht-textarea" />
      </section>

      <contactmoment-afhandel-form @save="saveContact" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";

import { useContactmomentStore } from "@/stores/contactmoment";
import { toast } from "@/stores/toast";

import {
  ContactmomentAfhandelForm,
  koppelKlant,
  useContactmomentService,
  ContactmomentNotitie,
  koppelObject,
  type Contactmoment,
} from "@/features/contactmoment";
import { ZakenOverzicht } from "@/features/zaaksysteem";

const router = useRouter();
const contactmomentStore = useContactmomentStore();
const saving = ref(false);
const contactmomentService = useContactmomentService();
const errorMessage = ref("");

console.log({ contactmomentStore });

const zakenToevoegenAanContactmoment = (contactmomentId: string) => {
  const promises = contactmomentStore?.zaken
    .filter((zaak) => zaak.shouldStore)
    .map((zaak) =>
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
.afhandeling {
  //center
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

.gerelateerde-resources {
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
