<template>
  <!-- TODO this is semantically weird: a list pretending to be a table -->
  <!-- Unless the user group has a very good reason, I would rather just make it a list of <dl>s with no fake header row -->
  <ul v-if="contactmomenten.length">
    <li class="header-row">
      <span id="datum-header">Datum</span>
      <span id="medewerker-header">Medewerker</span>
      <span id="kanaal-header">Kanaal</span>
      <span id="gespreksresultaat-header">Gespreksresultaat</span>
    </li>
    <li v-for="contactmoment in contactmomenten" :key="contactmoment.id">
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
          <template v-for="zaak in contactmoment.zaken" :key="zaak.zaaknummer">
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
  <p v-else>Geen contactmomenten gevonden.</p>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";
import type { ContactmomentViewModel } from "./types";

defineProps({
  contactmomenten: {
    type: Array as PropType<ContactmomentViewModel[]>,
    required: true,
  },
});

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

// const contactmomenten: Partial<ContacmomentViewModel>[] = [
//   {
//     id: "1234",
//     registratiedatum: "10-10-2020",
//     medewerker: "Tineke de Rooij",
//     kanaal: "Telefoon",
//     resultaat: "Contactverzoek > Babette de Jong",
//     startdatum: new Date(),
//     tekst:
//       "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti " +
//       "atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt " +
//       "in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est " +
//       "et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id " +
//       "quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem " +
//       "quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et " +
//       "molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus " +
//       "maiores alias consequatur aut perferendis doloribus asperiores repellat.",
//   },
//   {
//     id: "5678",
//     registratiedatum: "10-10-2020",
//     medewerker: "Tineke de Rooij",
//     kanaal: "Telefoon",
//     resultaat: "Contactverzoek > Babette de Jong",
//     startdatum: new Date(),
//     tekst: "Lorem ipsum",
//   },
// ];

// toggle <details> open status on click anywhere within <details>, not only on <summary>
const toggleDetails = (e: Event) => {
  e.preventDefault();
  if (e.currentTarget instanceof HTMLDetailsElement) {
    e.currentTarget.open = !e.currentTarget.open;
  }
};
</script>

<style lang="scss" scoped>
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
</style>
