<template>
  <article class="details-block">
    <utrecht-heading model-value :level="2"> Gegevens BRP</utrecht-heading>
    <dl>
      <dt>Naam</dt>
      <dd>
        {{
          [persoon.voornaam, persoon.voorvoegselAchternaam, persoon.achternaam]
            .filter(Boolean)
            .join(" ")
        }}
      </dd>
      <dt>Bsn</dt>
      <dd>{{ persoon.bsn }}</dd>
      <dt>Geboortedatum</dt>
      <dd>
        <dutch-date
          v-if="persoon.geboortedatum"
          :date="persoon.geboortedatum"
        />
      </dd>
      <dt>Geboorteplaats</dt>
      <dd>{{ persoon.geboorteplaats }}</dd>
      <dt>Geboorteland</dt>
      <dd>{{ persoon.geboorteland }}</dd>
      <dt>Postcode</dt>
      <dd>{{ persoon.postcode }}</dd>
    </dl>
  </article>
</template>

<script setup lang="ts">
import type { Persoon } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import DutchDate from "../../components/DutchDate.vue";

defineProps<{ persoon: Persoon }>();
</script>
