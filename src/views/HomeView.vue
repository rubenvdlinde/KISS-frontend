<template>
  <main>
    <header>
      <utrecht-heading model-value :level="1">Startscherm</utrecht-heading>
      <a
        v-if="userStore.hasAdminPostRole"
        :href="pubBeheerUrl"
        rel="noopener noreferrer"
        target="_blank"
        class="admin-link"
        >Items beheren</a
      >
    </header>
    <menu class="forms">
      <li>
        <form
          ref="searchForm"
          enctype="application/x-www-form-urlencoded"
          method="get"
          @submit="handleSubmit"
          class="search-bar"
        >
          <label
            for="werkberichtTypeInput"
            v-if="berichtTypes.state === 'success'"
          >
            Naar welk type bericht ben je op zoek?
            <select name="type" id="werkberichtTypeInput">
              <option value="">Alle</option>
              <option
                v-for="[key, label] in berichtTypes.data.entries"
                :key="`berichtTypes_${key}`"
                :value="key"
              >
                {{ label }}
              </option>
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
        </form>
      </li>
      <li>
        <form
          class="skills-form"
          method="get"
          v-if="skills.state === 'success'"
        >
          <multi-select
            name="skillIds"
            label="Filter op categorie"
            :options="skills.data.entries"
            v-model="currentSkills"
          />
          <menu class="delete-skills-menu">
            <li
              v-for="{ id, name, className } in selectedSkills"
              :key="'skills_cb_' + id"
            >
              <button
                type="button"
                :class="`remove-filter icon-after circle-xmark ${className}`"
                @click="currentSkills = currentSkills.filter((x) => x !== id)"
              >
                <span>Verwijder filter op </span><span>{{ name }}</span>
              </button>
            </li>
          </menu>
        </form>
      </li>
    </menu>
    <werk-berichten
      v-if="currentSearch || currentSkills.length"
      :level="2"
      page-param-name="werkberichtsearchpage"
      :search="currentSearch"
      :skill-ids="currentSkills"
      :type-id="currentTypeId"
      header="Zoekresultaten"
    />
    <template v-else>
      <werk-berichten
        :level="2"
        v-if="nieuwsId"
        header="Nieuws"
        page-param-name="nieuwspage"
        :typeId="nieuwsId"
      />
      <werk-berichten
        :level="2"
        v-if="werkInstructieId"
        header="Werkinstructies"
        page-param-name="werkinstructiepage"
        :typeId="werkInstructieId"
      />
    </template>
  </main>
  <contactmoment-starter />
</template>

<script setup lang="ts">
import {
  UtrechtHeading,
  UtrechtIconLoupe,
} from "@utrecht/web-component-library-vue";
import { computed, ref } from "vue";
import {
  useBerichtTypes,
  useSkills,
  WerkBerichten,
} from "@/features/werkbericht";
import { parseValidInt } from "@/services";
import MultiSelect from "@/components/MultiSelect.vue";
import { ContactmomentStarter } from "@/features/contactmoment";
import { useUserStore } from "@/stores/user";
const userStore = useUserStore();

const { pubBeheerUrl } = window;

const werkinstructie = "werkinstructie";
const nieuws = "nieuws";

const currentSearch = ref("");
const currentTypeId = ref<number>();
const currentSkills = ref<number[]>([]);

const berichtTypes = useBerichtTypes();
const skills = useSkills();

const selectedSkills = computed(() => {
  if (skills.state !== "success") return undefined;
  return skills.data.entries
    .map(([id, name]) => ({
      id,
      name,
      className: `category-${name.split(" ").join("-")}`,
    }))
    .filter((x) => currentSkills.value.includes(x.id));
});

const werkInstructieId = computed(
  () =>
    berichtTypes.state === "success" &&
    berichtTypes.data.fromValueToKey(werkinstructie)
);

const nieuwsId = computed(
  () =>
    berichtTypes.state === "success" && berichtTypes.data.fromValueToKey(nieuws)
);

function handleSubmit(e: Event) {
  const { currentTarget } = e;
  if (!(currentTarget instanceof HTMLFormElement)) return;
  e.preventDefault();
  const formData = new FormData(currentTarget);
  const obj = Object.fromEntries(formData);
  currentSearch.value = obj?.search?.toString() || "";
  currentTypeId.value = parseValidInt(obj?.type?.toString());
}

function handleSearch(e: Event) {
  const { currentTarget } = e;
  if (!(currentTarget instanceof HTMLInputElement)) return;
  e.preventDefault();
  currentSearch.value = currentTarget.value;
}
</script>

<style scoped lang="scss">
header {
  flex-flow: row wrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#werkberichtTypeInput {
  background-color: var(--color-secondary);
  border-inline-end: var(--border-style);
}

.admin-link {
  padding: var(--spacing-small);
  color: var(--color-headings);
}

.forms {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-default);
  align-items: flex-start;
  justify-content: space-between;
}

label[for="searchInput"] {
  flex: 1;
}

.search-bar {
  width: 100%;
}

.forms > :first-child {
  width: min(100%, var(--section-width));
}

.forms > :last-child {
  width: min(100%, 20rem);
  margin-inline-start: auto;
}

form {
  display: flex;
}

.remove-filter {
  display: flex;
  gap: 0.5rem;
  border: none;

  &:focus-visible {
    outline-color: var(--utrecht-focus-outline-color, transparent);
    outline-offset: var(--utrecht-focus-outline-offset, 0);
    outline-style: var(--utrecht-focus-outline-style, solid);
    outline-width: var(--utrecht-focus-outline-width, 0);
  }

  > :first-child {
    position: absolute;
    left: -999px;
  }
}

.skills-form {
  display: grid;
  gap: 1rem;
  align-items: flex-end;
  justify-items: flex-end;
  width: 100%;
}

menu {
  list-style: none;
}

.delete-skills-menu {
  display: flex;
  flex-flow: row wrap;
  gap: 0.5rem;
}
</style>
