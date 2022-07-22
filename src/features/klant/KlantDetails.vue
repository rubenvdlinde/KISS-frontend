<template>
  <utrecht-heading :level="level">Klantgegevens</utrecht-heading>
  <article>
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
import { ref, defineProps, type PropType } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

import ApplicationMessage from "@/components/ApplicationMessage.vue";
import type { Klant } from "./types";

defineProps({
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
</script>
