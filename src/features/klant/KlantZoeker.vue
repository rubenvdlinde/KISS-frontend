<template>
  <form class="search-bar" @submit.prevent="handleSearch">
    <label
      ><span>Klanten zoeken</span>
      <input
        type="search"
        placeholder="Zoek op e-mailadres of telefoonnummer"
        v-model="currentSearch"
        @search="handleSearch"
    /></label>
    <button title="Zoeken">
      <span>Zoeken</span><utrecht-icon-loupe model-value />
    </button>
  </form>

  <section v-if="searchQuery" class="search-section">
    <simple-spinner v-if="klanten.loading"></simple-spinner>
    <template v-if="klanten.success">
      <klanten-overzicht
        :klanten="klanten.data.page"
        v-on:[KLANT_SELECTED]="emitKlantSelected"
      />
      <pagination
        class="pagination"
        v-if="klanten.data.totalRecords"
        :pagination="klanten.data"
        @navigate="navigate"
      />
    </template>
    <application-message
      v-if="serviceResult?.error"
      messageType="error"
      message="Er is een fout opgetreden"
    ></application-message>
  </section>

  <h2>test data</h2>
  <p>0612345789<br />test@conduction.nl</p>
  <h2>todo</h2>
  <p>
    nog bepalen hoe om te gaan met zeer groot aantal resultaten<br />

    testen en anders bespreken of ook partial matches ondersteund kunnen worden.
    zo ja dan ook validatie aanpassen<br />
    zorgen dat gegevens niet verdwijenn als je van tab wisselt<br />
    in en uitklappen hoofd search ziet er raar uit (ligt bij gina)<br />
    nldesign table styles worden niet overgenomen. bv
    --utrecht-table-row-border-block-end-color zou toegepast moeten worden als
    er een utrecht-html class op de container div staat. zie
    https://nl-design-system.github.io/utrecht/storybook/?path=/docs/html-table--default-story
  </p>
</template>

<script lang="ts" setup>
import type { ServiceData } from "@/services";
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { ref, watch } from "vue";
import { useKlanten } from "./service";
import type { Klant } from "@/stores/contactmoment";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Pagination from "@/nl-design-system/components/Pagination.vue";
import { KLANT_SELECTED } from "./config";

const currentSearch = ref("");
const searchQuery = ref("");
const page = ref(1);
const klanten = useKlanten({ search: searchQuery, page });
const navigate = (val: number) => {
  page.value = val;
};

const serviceResult = ref<ServiceData<Klant>>();

const emit = defineEmits([KLANT_SELECTED]);
const emitKlantSelected = (klant: Klant) => emit(KLANT_SELECTED, klant);

watch(klanten, (k) => {
  if (k.success && k.data.page.length === 1) {
    emitKlantSelected(k.data.page[0]);
  }
});

const handleSearch = () => {
  searchQuery.value = currentSearch.value;
  page.value = 1;
};
</script>

<style lang="scss" scoped>
input {
  width: var(--section-width);
}
.search-bar {
  margin-bottom: var(--spacing-large);
}

.pagination {
  margin-inline: auto;
}

.search-section {
  display: grid;
  gap: var(--spacing-small);
}
</style>
