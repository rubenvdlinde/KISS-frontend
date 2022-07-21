<template>
  <p v-if="!klanten.length">Er zijn geen klanten gevonden</p>
  <table v-else>
    <thead>
      <th>Klantnummer</th>
      <th>Naam</th>
      <th>Telefoonnummer</th>
      <th>Emailadres</th>
      <th></th>
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

<script lang="ts" setup>
import type { Klant } from "./types";
import type { PropType } from "vue";

defineProps({
  klanten: { type: Array as PropType<Klant[]>, default: () => [] },
});

const emit = defineEmits(["onKlantSelected"]);
</script>

<style lang="scss" scoped>
th:not(:first-child),
td:not(:first-child) {
  padding-left: var(--spacing-default);
}

th,
td {
  padding-block: var(--spacing-small);
  text-align: left;
}
</style>
