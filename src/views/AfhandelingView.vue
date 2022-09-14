<template>
  <div class="afhandeling">
    <utrecht-heading :level="1" modelValue>Afhandeling</utrecht-heading>

    <a @click="$router.back()" href="#"> terug </a>

    <simple-spinner v-if="saving" />

    <application-message
      v-else-if="errorMessage != ''"
      messageType="error"
      :message="errorMessage"
    />

    <template v-else-if="contactmomentStore.contactmomentLoopt">
      <article v-for="(vraag, idx) in contactmomentStore.vragen" :key="idx">
        <utrecht-heading :level="2" model-value>
          Vraag {{ idx + 1 }}
        </utrecht-heading>
        <section v-if="vraag.klanten.length" class="gerelateerde-klanten">
          <utrecht-heading :level="3" model-value>{{
            vraag.klanten.length > 1
              ? "Gerelateerde klanten"
              : "Gerelateerde klant"
          }}</utrecht-heading>
          <ul>
            <li v-for="record in vraag.klanten" :key="record.klant.id">
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
        <section v-if="vraag.zaken.length > 0">
          <utrecht-heading :level="3" model-value>
            {{
              vraag.zaken.length > 1
                ? "Gerelateerde zaken"
                : "Gerelateerde zaak"
            }}
          </utrecht-heading>
          <zaken-overzicht :zaken="vraag.zaken.map(({ zaak }) => zaak)" />
        </section>
        <section>
          <contactmoment-notitie class="notitie utrecht-textarea" />
        </section>
      </article>

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

const zakenToevoegenAanContactmoment = (contactmomentId: string) => {
  const promises =
    contactmomentStore.huidigeVraag?.zaken
      .filter(({ shouldStore }) => shouldStore)
      .map(({ zaak }) =>
        koppelObject({
          contactmoment: contactmomentId,
          object: zaak.url,
          objectType: "zaak",
        })
      ) ?? [];
  return Promise.all(promises);
};

const koppelKlanten = (contactmomentId: string) => {
  const promises =
    contactmomentStore.huidigeVraag?.klanten
      .filter(({ shouldStore }) => shouldStore)
      .map(({ klant }) =>
        koppelKlant({
          contactmomentId,
          klantId: klant.id,
        })
      ) ?? [];
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
      if (contactmomentStore.huidigeVraag?.contactverzoek) {
        nextPromises.push(
          koppelContactverzoek(
            savedContactmoment.id,
            contactmomentStore.huidigeVraag.contactverzoek.url
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
  contactmoment.tekst = contactmomentStore.huidigeVraag?.notitie ?? "";
};

const enrichContactmomentWithStartdatum = (contactmoment: Contactmoment) => {
  contactmoment.startdatum = contactmomentStore.huidigeVraag?.startdatum ?? "";
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
