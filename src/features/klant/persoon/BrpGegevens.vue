<template>
  <article class="details-block">
    <utrecht-heading :level="2"> Gegevens BRP</utrecht-heading>
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
      <dt>Adres</dt>
      <dd>
        {{
          [
            persoon.straat,
            persoon.huisnummer,
            persoon.huisletter,
            persoon.huisnummertoevoeging,
          ]
            .filter(Boolean)
            .join(" ")
        }}
      </dd>
      <dt>Postcode</dt>
      <dd>{{ persoon.postcode }}</dd>
      <dt>Woonplaats</dt>
      <dd>{{ persoon.woonplaats }}</dd>
    </dl>
  </article>
</template>

<script setup lang="ts">
import type { Persoon } from "./types";
import { Heading as UtrechtHeading } from "@utrecht/component-library-vue";
import DutchDate from "@/components/DutchDate.vue";

defineProps<{ persoon: Persoon }>();
</script>
