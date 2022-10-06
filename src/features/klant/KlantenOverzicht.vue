<template>
  <div class="utrecht-html">
    <p v-if="!klanten.length">Er zijn geen klanten gevonden</p>
    <template v-else>
      <table>
        <caption>
          Zoekresultaten
        </caption>
        <thead>
          <tr>
            <th>Klantnummer</th>
            <th>Naam</th>
            <th>Telefoonnummer(s)</th>
            <th>E-mailadres(sen)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(klant, idx) in klanten"
            :key="idx"
            @click="emit('KlantSelected', klant)"
          >
            <td>{{ klant.klantnummer }}</td>
            <td>
              {{
                [
                  klant.voornaam,
                  klant.voorvoegselAchternaam,
                  klant.achternaam,
                ].join(" ")
              }}
            </td>
            <td>
              {{
                klant.telefoonnummers
                  .map(({ telefoonnummer }) => telefoonnummer)
                  .join(", ")
              }}
            </td>
            <td>{{ klant.emails.map(({ email }) => email).join(", ") }}</td>
            <td>
              <router-link
                :to="`/klanten/${klant.id}`"
                @click.prevent.stop="emit('KlantSelected', klant)"
                >{{ "> Ga naar" }}</router-link
              >
            </td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Klant } from "./types";
import type { PropType } from "vue";

defineProps({
  klanten: { type: Array as PropType<Klant[]>, default: () => [] },
});

const emit = defineEmits(["KlantSelected"]);
</script>

<style lang="scss" scoped>
table {
  width: 100%;
}

caption {
  padding-left: var(--spacing-default);
  padding-block: var(--spacing-small);
  margin-block: var(--spacing-small);
  text-align: left;
  font-size: var(--utrecht-typography-scale-lg);
  border-bottom: 1px solid var(--color-tertiary);
}
th,
td {
  padding-left: var(--spacing-default);

  padding-block: var(--spacing-default);
  text-align: left;
}

tbody tr {
  border-bottom: 1px solid var(--color-primary);

  &:hover {
    background-color: var(--color-secondary);
    cursor: pointer;
  }
}

a {
  color: var(--color-primary);
}
</style>
