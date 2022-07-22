<template>
  <article>
    <utrecht-heading :level="level">Klantgegevens</utrecht-heading>
    <table>
      <thead>
        <th>Klantnummer</th>
        <th>Naam</th>
        <th>Telefoonnummer</th>
        <th>Emailadres</th>
        <th></th>
      </thead>
      <tbody>
        <tr>
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
  </article>
  <p>
    hier tonen we dezelfde gegevens als in het zoekresultaat plus zaken en
    contactmomenten (notities volgen later)<br />
    via /api/klantcontactmomenten?extend[]=al halen we de contactmomenten op.<br />
    via het zaaksysteem of zitten die hier ook als extend in?<br />
    terug naar zoeken knop<br />
  </p>
</template>

<script lang="ts" setup>
import { ref, defineProps, watch, type PropType } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import { useKlantService } from "./service";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import type { Klant } from "./types";

const props = defineProps({
  klant: {
    type: Object as PropType<Klant>,
    default: () => {
      return {
        klantnummer: "",
        voornaam: "",
        voorvoegselAchternaam: "",
        achternaam: "",
        telefoonnummer: "",
        emailadres: "",
      };
    },
  },
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 2,
  },
});

const klantService = useKlantService();

const klant = ref(props.klant);
const klantData = ref({});
watch(klant, (newValue) => {
  klantData.value = klantService.getKlant(newValue.klantnummer);
});
</script>

<style lang="scss" scoped>
article {
  background-color: var(--color-secondary);
  padding: var(--spacing-large);
  margin-block: var(--spacing-large);
}
table {
  margin-block-start: var(--spacing-default);
}

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
  padding-block: var(--spacing-small);
  text-align: left;
}
</style>
