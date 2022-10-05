<template>
  <section class="container">
    <utrecht-heading class="contactmomenten-header" model-value :level="2">
      Zaken
    </utrecht-heading>

    <simple-spinner v-if="zaken.loading" />

    <p v-else-if="zaken.error">Er ging iets mis. Probeer het later nog eens.</p>

    <table v-else-if="zaken.data.page.length">
      <thead>
        <th>Zaaknummer</th>
        <th>Zaaktype</th>
        <th>Status</th>
        <th>Behandelaar</th>
        <th>Indien datum</th>
        <th>Fatale datum</th>
        <th></th>
      </thead>

      <tbody>
        <tr
          v-for="zaak in zaken.data.page"
          :key="zaak.id"
          @click="handleZaakSelected(zaak)"
        >
          <td>{{ zaak.identificatie }}</td>
          <td>{{ zaak.zaaktype }}</td>
          <td>{{ zaak.status }}</td>
          <td>{{ zaak.behandelaar }}</td>
          <td>{{ formatDateOnly(zaak.startdatum) }}</td>
          <td>{{ formatDateOnly(zaak.fataleDatum) }}</td>
          <th>
            <router-link
              :to="`/zaken/${zaak.id}`"
              @click.prevent.stop="handleZaakSelected(zaak)"
              >{{ "> Ga naar" }}</router-link
            >
          </th>
        </tr>
      </tbody>
    </table>

    <p v-else>Geen zaken gevonden.</p>
  </section>
</template>

<script setup lang="ts">
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { useZakenByBsn } from "./service";
import { formatDateOnly } from "@/helpers/date";
import type { Zaak } from "./types";
import { useContactmomentStore } from "@/stores/contactmoment";
import { useRouter } from "vue-router";
import { computed } from "vue";

const contactmomentStore = useContactmomentStore();
const router = useRouter();

const props = defineProps({
  klantBsn: {
    type: String,
    required: true,
  },
});

const zaken = useZakenByBsn(computed(() => props.klantBsn));

const handleZaakSelected = (zaak: Zaak) => {
  if (!contactmomentStore.huidigContactmoment) return;
  contactmomentStore.upsertZaak(
    zaak,
    contactmomentStore.huidigContactmoment.huidigeVraag
  );
  router.push({ name: "zaakDetail", params: { zaakId: zaak.id } });
};
</script>

<style lang="scss" scoped>
.container {
  > *:not(:last-child) {
    margin-block-end: var(--spacing-default);
  }
}

table {
  width: 100%;
}

th,
td {
  text-align: left;
  padding-inline-start: var(--spacing-default);
  padding-block: var(--spacing-default);
}

tbody tr {
  border-bottom: 1px solid var(--color-primary);
  &:hover {
    background-color: var(--color-secondary);
    cursor: pointer;
  }
}

a {
  color: var(--color-primary);
}
</style>
