<template>
  <section>
    <utrecht-heading :level="2" modelValue>Algemeen</utrecht-heading>

    <div class="content">
      <ul>
        <li>
          <span class="label">Zaaktype</span>
          <span class="value">{{ zaak.zaaktypeOmschrijving }}</span>
        </li>
        <li>
          <span class="label">Aanvrager</span>
          <span class="value">{{ zaak.aanvrager }}</span>
        </li>
        <li>
          <span class="label">Status</span>
          <span class="value">{{ zaak.status }}</span>
        </li>
        <li>
          <span class="label">Behandelaar</span>
          <span class="value">{{ zaak.behandelaar }}</span>
        </li>
        <li>
          <span class="label">Zaaknummer</span>
          <span class="value">{{ zaak.identificatie }}</span>
        </li>
      </ul>

      <ul>
        <li>
          <span class="label">Titel</span>
          <span class="value">{{ zaak.omschrijving }}</span>
        </li>
        <li>
          <span class="label">Indiendatum</span>
          <span class="value">{{ formatDateOnly(zaak.indienDatum) }}</span>
        </li>
        <li>
          <span class="label">Registratiedatum</span>
          <span class="value">{{ formatDateOnly(zaak.registratieDatum) }}</span>
        </li>
        <li>
          <span class="label">Startdatum</span>
          <span class="value">{{
            formatDateOnly(new Date(zaak.startdatum))
          }}</span>
        </li>
        <li>
          <span class="label">Streefdatum</span>
          <span class="value">{{ formatDateOnly(zaak.streefDatum) }}</span>
        </li>
        <li>
          <span class="label">Fatale datum</span>
          <span class="value">{{ formatDateOnly(zaak.fataleDatum) }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import type { ZaakDetails } from "./../types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { formatDateOnly } from "@/helpers/date";

defineProps<{
  zaak: ZaakDetails;
}>();
</script>

<style scoped lang="scss">
section {
  padding: var(--spacing-large);

  & > *:not(:last-child) {
    margin-block-end: var(--spacing-large);
  }
}

.content {
  display: flex;

  > * {
    flex: 1;
  }

  > *:not(:last-child) {
    margin-inline-end: var(--spacing-large);
  }
}

ul > li:not(:last-child) {
  margin-block-end: var(--spacing-default);
}

li {
  display: flex;

  & > .label {
    flex: 1;
    max-width: 175px;
  }
  & > .value {
    flex: 1;
  }
}

.label {
  font-weight: 600;
}
</style>
