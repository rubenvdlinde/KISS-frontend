<template>
  <utrecht-heading model-value :level="1">Startscherm</utrecht-heading>
  <a
    :href="pubBeheerUrl"
    rel="noopener noreferrer"
    target="_blank"
    class="admin-link"
    >Items beheren</a
  >
  <form
    ref="searchForm"
    enctype="application/x-www-form-urlencoded"
    method="get"
    @submit="handleSubmit"
  >
    <section>
      <label for="werkberichtTypeInput">
        Naar welk type bericht ben je op zoek?
        <select name="type" id="werkberichtTypeInput">
          <option value="">Alle</option>
          <option :value="werkinstructie">Werkinstructies</option>
          <option :value="nieuws">Nieuws</option>
        </select>
      </label>
      <label for="searchInput"
        ><span>Zoek een werkinstructie of nieuwsbericht</span>
        <input
          type="search"
          name="search"
          id="searchInput"
          placeholder="Zoek een werkinstructie of nieuwsbericht"
          @search="handleSearch"
      /></label>
      <button title="Zoeken">
        <span>Zoeken</span><utrecht-icon-loupe model-value />
      </button>
    </section>
  </form>
  <werk-berichten
    v-if="filter"
    :level="2"
    page-param-name="werkberichtsearchpage"
    :filter="filter"
    header="Zoekresultaten"
  />
  <template v-else>
    <werk-berichten
      :level="2"
      header="Nieuws"
      page-param-name="nieuwspage"
      :filter="{
        type: nieuws,
      }"
    />
    <werk-berichten
      :level="2"
      header="Werkinstructies"
      page-param-name="werkinstructiepage"
      :filter="{
        type: werkinstructie,
      }"
    />
  </template>
  <contactmoment-starter />
</template>

<script setup lang="ts">
import {
  UtrechtHeading,
  UtrechtIconLoupe,
} from "@utrecht/web-component-library-vue";
import { computed, ref } from "vue";
import { WerkBerichten } from "@/features/werkbericht";
import ContactmomentStarter from "@/features/contactmoment/ContactmomentStarter.vue";

const { pubBeheerUrl } = window;

const werkinstructie = "werkinstructie";
const nieuws = "nieuws";

const currentSearch = ref("");
const currentType = ref("");

function handleSubmit(e: Event) {
  const { currentTarget } = e;
  if (!(currentTarget instanceof HTMLFormElement)) return;
  e.preventDefault();
  const formData = new FormData(currentTarget);
  const obj = Object.fromEntries(formData);
  currentSearch.value = obj?.search?.toString() || "";
  currentType.value = obj?.type?.toString() || "";
}

function handleSearch(e: Event) {
  const { currentTarget } = e;
  if (!(currentTarget instanceof HTMLInputElement)) return;
  e.preventDefault();
  currentSearch.value = currentTarget.value;
}

const filter = computed(() =>
  currentSearch.value
    ? {
        search: currentSearch.value,
        type: currentType.value,
      }
    : undefined
);
</script>

<style scoped lang="scss">
form {
  margin-block-end: 2rem;
}

form > section {
  display: inline-flex;
  align-items: stretch;
  --border-style: 1px solid var(--color-primary);

  input,
  select,
  button {
    border: none;
    border-block: var(--border-style);

    &:focus {
      outline-color: var(--color-primary);
    }
  }

  > :first-child {
    input,
    select {
      border-radius: 1.5rem 0 0 1.5rem;
      border-inline-start: var(--border-style);
    }
  }

  > :last-child {
    border-radius: 0 1.5rem 1.5rem 0;
    border-inline-end: var(--border-style);
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
  padding: 0.5rem;
}

#werkberichtTypeInput {
  background-color: var(--color-grey);
  border-inline-end: var(--border-style);
}

#searchInput {
  min-width: 40ch;
  max-width: 100%;
  padding-left: 1rem;

  &::placeholder {
    color: black;
  }
}

button {
  --utrecht-icon-size: 1rem;

  border: none;
  background: white;
  font-size: 0;
  padding-right: var(--spacing-default);
}

utrecht-icon-loupe {
  pointer-events: none;
}

.admin-link {
  position: absolute;
  inset-inline-end: 0;
  inset-block-start: 0;
  margin-block-start: 3.75rem;
  margin-inline-end: var(--spacing-default);
  color: var(--color-headings);
}
</style>
