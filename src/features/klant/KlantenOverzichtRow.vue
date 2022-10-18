<template>
  <dialog ref="dialog">
    <simple-spinner />
  </dialog>
  <tr class="row-link" v-bind="$attrs">
    <template v-if="result.klant.success">
      <th scope="row" class="wrap">
        {{
          result.klant.data?.naam ||
          (result.persoon.success && result.persoon.data?.naam)
        }}
      </th>
      <td class="wrap">
        {{ result.klant.data?.emails }}
      </td>
      <td class="wrap">
        {{ result.klant.data?.telefoonnummers }}
      </td>
    </template>
    <td v-else colspan="3">
      <simple-spinner class="spinner" v-if="result.klant.loading" />
    </td>
    <td>
      {{ result.bsn }}
    </td>
    <template v-if="result.persoon.success">
      <td>
        <dutch-date
          v-if="result.persoon.data?.geboortedatum"
          :date="result.persoon.data.geboortedatum"
        />
      </td>
      <td>{{ result.persoon.data?.postcodeHuisnummer }}</td>
    </template>
    <td colspan="2" v-else>
      <simple-spinner class="spinner" v-if="result.persoon.loading" />
    </td>
    <td>
      <template v-if="result.klant.success">
        <router-link
          v-if="result.klant.data?.link"
          v-bind="result.klant.data.link"
        />
        <button
          type="button"
          title="Aanmaken"
          v-else
          @click="result.create()"
        />
      </template>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { mapServiceData } from "@/services";
import { computed, ref } from "vue";
import { ensureKlantForBsn } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import { useRouter } from "vue-router";
import DutchDate from "@/components/DutchDate.vue";
import { useEnrichedPersoon } from "./persoon-enricher";

const props = defineProps<{ record: Klant | Persoon }>();

const [bsnRef, persoonData, klantData] = useEnrichedPersoon(() => props.record);

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapKlant(klant: Klant | null) {
  if (!klant) return null;
  const naam = [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
    .filter(Boolean)
    .join(" ");
  return {
    naam,
    telefoonnummers: klant.telefoonnummers
      .map(({ telefoonnummer }) => telefoonnummer)
      .filter(Boolean)
      .join(", "),
    emails: klant.emails
      .map(({ email }) => email)
      .filter(Boolean)
      .join(", "),
    link: {
      to: getKlantUrl(klant),
      title: `Details ${naam}`,
    },
  };
}

function mapPersoon(persoon: Persoon | null) {
  if (!persoon) return null;
  const naam = [
    persoon.voornaam,
    persoon.voorvoegselAchternaam,
    persoon.achternaam,
  ]
    .filter(Boolean)
    .join(" ");
  return {
    geboortedatum: persoon.geboortedatum,
    naam,
    postcodeHuisnummer: [persoon.postcode, persoon.huisnummer]
      .filter(Boolean)
      .join(" "),
  };
}

const router = useRouter();

const dialog = ref<HTMLDialogElement>();

const create = async () => {
  try {
    if (!bsnRef.value) return;
    dialog.value?.showModal();
    const newKlant = await ensureKlantForBsn(bsnRef.value);
    const url = getKlantUrl(newKlant);
    router.push(url);
  } finally {
    dialog.value?.close();
  }
};

const result = computed(() => {
  const klant = mapServiceData(klantData.value, mapKlant);
  const persoon = mapServiceData(persoonData.value, mapPersoon);

  return {
    bsn: bsnRef.value,
    klant,
    persoon,
    create,
  };
});
</script>

<style scoped lang="scss">
td {
  > .spinner {
    font-size: inherit;
  }

  &:empty::after {
    content: "-";
  }
}

dialog[open] {
  width: 100%;
  height: 100%;
  display: flex;
  place-content: center;
  place-items: center;
}
</style>
