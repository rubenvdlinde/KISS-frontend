<template>
  <article>
    <utrecht-heading model-value :level="level">Klantgegevens</utrecht-heading>
    <table>
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
        <tr>
          <td>{{ klant.klantnummer }}</td>
          <td>
            {{
              [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
                .filter((x) => x)
                .join(" ")
            }}
          </td>
          <td>
            {{ klant.telefoonnummers.map((x) => x.telefoonnummer).join(", ") }}
          </td>
          <td>{{ klant.emails.map((x) => x.email).join(", ") }}</td>
        </tr>
      </tbody>
    </table>
  </article>
</template>

<script lang="ts" setup>
import { defineProps, type PropType } from "vue";
import { UtrechtHeading } from "@utrecht/web-component-library-vue";
import type { Klant } from "@/stores/contactmoment";

defineProps({
  klant: {
    type: Object as PropType<Klant>,
    required: true,
  },
  level: {
    type: Number as PropType<1 | 2 | 3 | 4 | 5>,
    default: 2,
  },
});
</script>

<style lang="scss" scoped>
article {
  background-color: var(--color-secondary);
  padding: var(--spacing-default);
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
  text-align: left;
  padding-block: var(--spacing-default);
}
</style>
