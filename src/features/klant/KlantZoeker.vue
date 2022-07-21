<template>
  <form class="search-bar" @submit.prevent="handleSearch">
    <label for="searchInput"
      ><span>Klanten zoeken</span>
      <input
        type="search"
        placeholder="Zoek op e-mailadres of telefoonnummer"
        v-model="searchQuery"
    /></label>
    <button type="submit" title="Zoeken" @click.prevent="handleSearch">
      <span>Zoeken</span><utrecht-icon-loupe model-value />
    </button>
  </form>

  <simple-spinner v-if="serviceResult?.loading"></simple-spinner>

  <klanten-overzicht
    @onKlantSelected="handleKlantSelected"
    v-if="serviceResult?.success"
    :klanten="klanten"
  ></klanten-overzicht>

  <application-message
    v-if="serviceResult?.error"
    messageType="error"
    message="Er is een fout opgetreden"
  ></application-message>

  <h2>test data</h2>
  <p>0612345789<br />test@conduction.nl</p>
  <h2>todo</h2>
  <p>
    als er 1 resultaat direct de details tonen<br />
    nog bepalen hoe om te gaan met zeer groot aantal resultaten<br />
    validatie op input format en lengte<br />
    zorgen dat gegevens niet verdwijenn als je van tab wisselt
  </p>
</template>

<script lang="ts" setup>
import type { ServiceData } from "@/services";
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { ref } from "vue";
import { useKlantService } from "./service";
import type { Klant } from "./types";
import KlantenOverzicht from "./KlantenOverzicht.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import SimpleSpinner from "@/components/SimpleSpinner.vue";

const searchQuery = ref("");
const klanten = ref<Klant[]>([]);
const service = useKlantService();
const serviceResult = ref<ServiceData<Klant>>();

const emit = defineEmits(["onKlantSelected"]);

const isEmail = (val: string) =>
  val.match(
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
  );

const handleSearch = () => {
  const result = isEmail(searchQuery.value)
    ? service.searchByEmail(searchQuery.value)
    : service.searchByTelnr(searchQuery.value);
  serviceResult.value = result.state;
  result.promise.then((data) => {
    klanten.value = data;

    if (klanten.value.length === 1) {
      emit("onKlantSelected", klanten.value[0]);
    }
  });
};

const handleKlantSelected = (klant: any) => {
  emit("onKlantSelected", klant);
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
