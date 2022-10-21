<template>
  <article class="details-block">
    <utrecht-heading model-value :level="2">
      Gegevens Handelsregister</utrecht-heading
    >
    <dl>
      <dt>Bedrijfsnaam</dt>
      <dd>{{ bedrijf.bedrijfsnaam }}</dd>
      <dt>KvK-nummer</dt>
      <dd>{{ bedrijf.kvknummer }}</dd>
      <dt>Vestigingsnummer</dt>
      <dd>
        {{ bedrijf.vestigingsnummer }}
      </dd>
      <dt>Adres</dt>
      <dd>
        {{
          [
            bedrijf.straatnaam,
            bedrijf.huisnummer,
            bedrijf.huisletter,
            bedrijf.huisnummertoevoeging,
          ]
            .filter(Boolean)
            .join(" ")
        }}
      </dd>
      <dt>Postcode</dt>
      <dd>{{ bedrijf.postcode }}</dd>
      <dt>E-mailadres</dt>
      <dd>{{ bedrijf.email }}</dd>
      <dt>Telefoonnummer</dt>
      <dd>{{ bedrijf.telefoonnummer }}</dd>
    </dl>
  </article>
</template>

<script setup lang="ts">
import type { Bedrijf } from "./types";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";

defineProps<{ bedrijf: Bedrijf }>();
</script>
