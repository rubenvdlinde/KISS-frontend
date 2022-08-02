<template>
  <!-- TODO this is semantically weird: a list pretending to be a table -->
  <!-- Unless the user group has a very good reason, I would rather just make it a list of <dl>s with no fake header row -->
  <article>
    <utrecht-heading class="contactmomenten-header" model-value :level="level">
      Contactmomenten
    </utrecht-heading>
    <simple-spinner v-if="contactmomenten.loading" />
    <p v-else-if="contactmomenten.error">
      Er ging iets mis. Probeer het later nog eens.
    </p>
    <template v-else-if="contactmomenten.data.page.length">
      <ul>
        <li class="header-row">
          <span id="datum-header">Datum</span>
          <span id="medewerker-header">Medewerker</span>
          <span id="kanaal-header">Kanaal</span>
          <span id="gespreksresultaat-header">Gespreksresultaat</span>
        </li>
        <li
          v-for="contactmoment in contactmomenten.data.page"
          :key="contactmoment.id"
        >
          <details @click="toggleDetails">
            <summary>
              <span aria-labelledby="datum-header" class="first-column">{{
                localeDate(contactmoment?.startdatum)
              }}</span>
              <span aria-labelledby="medewerker-header">{{
                contactmoment.medewerker
              }}</span>
              <span aria-labelledby="kanaal-header">{{
                contactmoment.kanaal
              }}</span>
              <span aria-labelledby="gespreksresultaat-header">{{
                contactmoment.resultaat
              }}</span>
            </summary>
            <dl>
              <dd>Starttijd</dd>
              <dt>{{ localeTime(contactmoment.startdatum) }}</dt>
              <template
                v-for="zaak in contactmoment.zaken"
                :key="zaak.zaaknummer"
              >
                <dd>Zaaknummer</dd>
                <dt>{{ zaak.zaaknummer }}</dt>
                <dd>Zaaktype</dd>
                <dt>{{ zaak.zaaktype }}</dt>
                <dd>Status</dd>
                <dt>{{ zaak.status }}</dt>
              </template>
              <dd>Tekst</dd>
              <dt class="tekst">{{ contactmoment.tekst }}</dt>
            </dl>
          </details>
        </li>
      </ul>
      <pagination class="pagination" :pagination="contactmomenten.data" />
    </template>
    <p v-else>Geen contactmomenten gevonden.</p>
  </article>
</template>

<script lang="ts" setup>
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { computed, ref, type PropType } from "vue";
import { useKlantContactmomenten } from "./service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Pagination from "../../nl-design-system/components/Pagination.vue";

const props = defineProps({
  klantId: {
    type: String,
    required: true,
  },
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 2,
  },
});

const page = ref(1);
const contactmomenten = useKlantContactmomenten(
  computed(() => ({
    id: props.klantId,
    page: page.value,
  }))
);

const localeDate = (d?: Date) =>
  d?.toLocaleString("nl-NL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: undefined,
    minute: undefined,
  });

const localeTime = (d?: Date) =>
  d?.toLocaleString("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
  });

// toggle <details> open status on click anywhere within <details>, not only on <summary>
const toggleDetails = (e: Event) => {
  e.preventDefault();
  if (e.currentTarget instanceof HTMLDetailsElement) {
    e.currentTarget.open = !e.currentTarget.open;
  }
};
</script>

<style lang="scss" scoped>
article {
  display: grid;
}

.pagination {
  justify-self: center;
}

ul {
  --column-width: 25ch;
  --gap: var(--spacing-small);

  display: grid;
  list-style: none;
  padding: 0;
}

summary,
ul {
  list-style: none;
}

li:not(:first-child):not(:last-child) {
  border-bottom: 1px solid var(--color-tertiary);
}

.header-row,
dd {
  font-weight: bold;
}

.header-row,
summary {
  display: grid;
  gap: var(--gap);
  grid-template-columns: repeat(3, var(--column-width)) 1fr;
}

dl {
  display: grid;
  column-gap: var(--gap);
  row-gap: 1rem;
  grid-template-columns: var(--column-width) 1fr;
  padding-block: var(--spacing-large);
}

.tekst {
  max-width: 90ch;
  line-height: 1.5rem;
}

.headers {
  margin-bottom: var(--gap);
}

details {
  display: grid;
  gap: var(--spacing-default);
}

details:hover {
  cursor: pointer;
}

details,
.header-row {
  padding: var(--spacing-default);
}

details[open],
details:hover {
  background-color: var(--color-secondary);
}

utrecht-heading {
  margin-inline-start: var(--spacing-default);
}
</style>
