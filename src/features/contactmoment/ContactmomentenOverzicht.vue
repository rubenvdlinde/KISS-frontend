<template>
  <!-- TODO this is semantically weird: a list pretending to be a table -->
  <!-- Unless the user group has a very good reason, I would rather just make it a list of <dl>s with no fake header row -->
  <section>
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
          <span id="medewerker-header" class="col-lg">Medewerker</span>
          <span id="kanaal-header">Kanaal</span>
          <span id="gespreksresultaat-header" class="col-lg"
            >Gespreksresultaat</span
          >
        </li>
        <li
          v-for="contactmoment in contactmomenten.data.page"
          :key="contactmoment.id"
        >
          <details @click="toggleDetails">
            <summary>
              <span aria-labelledby="datum-header" class="first-column">{{
                formatDateOnly(contactmoment.registratiedatum)
              }}</span>
              <span aria-labelledby="medewerker-header" class="col-lg">{{
                contactmoment["x-commongateway-metadata"].owner
              }}</span>
              <span aria-labelledby="kanaal-header">{{
                contactmoment.kanaal
              }}</span>
              <span aria-labelledby="gespreksresultaat-header" class="col-lg">{{
                contactmoment.resultaat
              }}</span>
            </summary>
            <dl>
              <dt>Starttijd</dt>
              <dd>{{ formatTimeOnly(contactmoment.registratiedatum) }}</dd>
              <template
                v-for="zaak in contactmoment.zaken"
                :key="zaak.zaaknummer"
              >
                <dt>Zaaknummer</dt>
                <dd>{{ zaak.zaaknummer }}</dd>
                <dt>Zaaktype</dt>
                <dd>{{ zaak.zaaktype }}</dd>
                <dt>Status</dt>
                <dd>{{ zaak.status }}</dd>
              </template>
              <dt>Tekst</dt>
              <dd class="tekst">{{ contactmoment.tekst }}</dd>
            </dl>
            <p
              v-for="(
                { medewerkers, completed }, i
              ) in contactmoment.contactverzoeken"
              :key="i"
            >
              Contactverzoek verstuurd aan {{ medewerkers.join(", ") }}. Dit
              verzoek {{ completed ? "is afgerond" : "staat open" }}.
            </p>
          </details>
        </li>
      </ul>
      <pagination
        class="pagination"
        :pagination="contactmomenten.data"
        @navigate="onNavigate"
      />
    </template>
    <p v-else>Geen contactmomenten gevonden.</p>
  </section>
</template>

<script lang="ts" setup>
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { computed, ref, type PropType } from "vue";
import { useKlantContactmomenten } from "./service";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Pagination from "../../nl-design-system/components/Pagination.vue";
import { formatDateOnly, formatTimeOnly } from "@/helpers/date";

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

console.log({ contactmomenten });

const onNavigate = (p: number) => {
  page.value = p;
};

// toggle <details> open status on click anywhere within <details>, not only on <summary>
const toggleDetails = (e: Event) => {
  e.preventDefault();
  if (e.currentTarget instanceof HTMLDetailsElement) {
    e.currentTarget.open = !e.currentTarget.open;
  }
};
</script>

<style lang="scss" scoped>
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
dt {
  font-weight: bold;
}

.header-row,
summary {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 2fr 1.5rem;
  gap: var(--gap);
}

dl {
  padding-inline-start: var(--spacing-default);
  display: grid;
  column-gap: var(--gap);
  row-gap: 1rem;
  grid-template-columns: var(--column-width) 1fr;
  padding-block: var(--spacing-large);
}

summary {
  span {
    padding-inline-start: var(--spacing-default);
  }
}

.tekst {
  max-width: 90ch;
  white-space: pre-wrap;
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
  padding-block-start: var(--spacing-default);
  padding-block-end: var(--spacing-default);

  span {
    padding-inline-start: var(--spacing-default);
  }
}

details[open],
details:hover {
  background-color: var(--color-secondary);
}
</style>
