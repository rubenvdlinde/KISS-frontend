<template>
  <utrecht-heading :level="1">Startscherm</utrecht-heading>
  <a
    href="https://gateway.kiss-dev.commonground.nu/"
    rel="noopener noreferrer"
    target="_blank"
    class="admin-link"
    >Items beheren</a
  >
  <form
    enctype="application/x-www-form-urlencoded"
    method="get"
    @submit.prevent="submitSearch"
  >
    <section>
      <label for="werkberichtTypeInput">
        Naar welk type bericht ben je op zoek?
        <select name="type" id="werkberichtTypeInput">
          <option value="">Alle</option>
          <option
            value="Werkinstructie"
            :selected="currentType === 'Werkinstructie'"
          >
            Werkinstructies
          </option>
          <option
            value="Nieuwsbericht"
            :selected="currentType === 'Nieuwsbericht'"
          >
            Nieuws
          </option>
        </select>
      </label>
      <label for="searchInput"
        ><span>Zoek een werkinstructie of nieuwsbericht</span>
        <input
          type="search"
          name="search"
          @search="handleSearch"
          id="searchInput"
          :value="currentSearch"
          placeholder="Zoek een werkinstructie of nieuwsbericht"
      /></label>
      <button title="Zoeken"><span>Zoeken</span><utrecht-icon-loupe /></button>
    </section>
  </form>
  <werk-berichten
    v-if="filter"
    :level="2"
    :filter="filter"
    header="Zoekresultaten"
  />
  <template v-else>
    <werk-berichten
      :level="2"
      header="Nieuws"
      :filter="{
        type: 'Nieuwsbericht',
      }"
    />
    <werk-berichten
      :level="2"
      header="Werkinstructies"
      :filter="{
        type: 'Werkinstructie',
      }"
    />
  </template>
</template>

<script setup lang="ts">
import { WerkBerichten } from "@/features/werkbericht";
import {
  UtrechtHeading,
  UtrechtIconLoupe,
} from "@utrecht/web-component-library-vue";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
const router = useRouter();
const route = useRoute();
const currentSearch = computed(() => route.query.search?.toString());
const currentType = computed(() => route.query.type?.toString());
const filter = computed(() =>
  currentSearch.value
    ? {
        search: currentSearch.value,
        type: currentType.value,
      }
    : undefined
);

function submitSearch(e: Event) {
  if (e.currentTarget instanceof HTMLFormElement) {
    const formData = new FormData(e.currentTarget);
    const entries = Array.from(formData.entries()).map(([k, v]) => [
      k,
      v.toString(),
    ]);
    const urlParams = new URLSearchParams(entries);
    router.push("/?" + urlParams.toString());
  }
}

function handleSearch(e: Event) {
  const { currentTarget } = e;
  if (
    currentSearch.value &&
    currentTarget instanceof HTMLInputElement &&
    !currentTarget.value
  ) {
    router.push("/");
  }
}
</script>

<style scoped lang="scss">
form > section {
  display: inline-flex;
  align-items: stretch;
  border-radius: 1.5rem;
  border: 1px solid black;
  overflow: hidden;
  box-sizing: border-box;

  > *:not(:last-child) {
    border-inline-end: 1px solid grey;
  }
}

label[for="werkberichtTypeInput"],
label[for="searchInput"] {
  font-size: 0;
  display: flex;
  align-items: stretch;
}

input,
select {
  border: none;
  padding: 0.5rem;
}

#werkberichtTypeInput {
  background-color: #e8e4dc;
}

#searchInput {
  min-width: 40ch;
  max-width: 100%;
  padding-left: 1rem;
}

button {
  --utrecht-icon-size: 1rem;

  border: none;
  background: white;
  font-size: 0;
  padding-right: 1rem;
}

utrecht-icon-loupe {
  pointer-events: none;
}

.admin-link {
  position: absolute;
  inset-inline-end: 0;
  inset-block-start: 0;
  margin-top: 3.75rem;
  color: var(--color-headings);
}
</style>
