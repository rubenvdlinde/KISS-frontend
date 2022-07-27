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

  <template v-if="searchQuery">
    <simple-spinner v-if="klanten.loading"></simple-spinner>
    <template v-if="klanten.success">
      <klanten-overzicht :klanten="klanten.data.page" />
      <pagination
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
  </template>

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
import { ref } from "vue";
import { useKlanten } from "./service";
import type { Klant } from "./types";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Pagination from "@/nl-design-system/components/Pagination.vue";

const currentSearch = ref("");
const searchQuery = ref("");
const page = ref(1);
const klanten = useKlanten({ search: searchQuery, page });
const navigate = (val: number) => {
  page.value = val;
};

const serviceResult = ref<ServiceData<Klant>>();

const emit = defineEmits(["onKlantSelected"]);

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
</style>
