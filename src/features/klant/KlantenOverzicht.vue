<template>
  <div class="utrecht-html utrecht-theme">
    <p v-if="!klanten.length">Er zijn geen klanten gevonden</p>
    <template v-else>
      <table>
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
            <td>{{ klant.telefoonnummer }}</td>
            <td>{{ klant.emailadres }}</td>
          </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { Klant } from "@/stores/contactmoment";
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

th,
td {
  padding-left: var(--spacing-default);

  padding-block: var(--spacing-default);
  text-align: left;
}

tr:nth-child(2n) {
  background-color: var(--color-secondary);
}
</style>
