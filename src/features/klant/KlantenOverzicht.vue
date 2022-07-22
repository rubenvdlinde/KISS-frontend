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
            <th>Telefoonnummer</th>
            <th>Emailadres</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="klant in klanten"
            :key="klant.klantnummer"
            @click="emit('onKlantSelected', klant)"
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
            <td>{{ klant.telefoonnummer }}</td>
            <td>{{ klant.emailadres }}</td>
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

const emit = defineEmits(["onKlantSelected"]);
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

tr:nth-child(2n) {
  background-color: var(--color-secondary);
}

tbody tr:hover,
tbody td:hover {
  background-color: var(--color-tertiary);
  border-bottom: 1px solid var(--color-primary);
  cursor: pointer;
}
</style>
