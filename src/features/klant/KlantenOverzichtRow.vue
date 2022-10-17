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
      <td>{{ result.persoon.data?.adres }}</td>
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
import { ensureKlantForBsn, useKlantByBsn } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { useRouter } from "vue-router";
import { usePersoonByBsn } from "./brp/service";
import { useEnricher } from "./service-data-enricher";
import DutchDate from "../../components/DutchDate.vue";

const dialog = ref<HTMLDialogElement>();

const props = defineProps<{ record: Klant | Persoon }>();

const getEnrichedData = useEnricher(
  () =>
    props.record._brand === "klant"
      ? [props.record, undefined]
      : [undefined, props.record],
  (k) => k.bsn,
  (p) => p.bsn,
  useKlantByBsn,
  usePersoonByBsn
);

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapKlant(klant?: Klant | null) {
  if (!klant) return null;
  const naam = [klant.voornaam, klant.voorvoegselAchternaam, klant.achternaam]
    .filter(Boolean)
    .join(" ");
  return {
    ...klant,
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

function mapPersoon(persoon?: Persoon | null) {
  if (!persoon) return null;
  const naam = [
    persoon.voornaam,
    persoon.voorvoegselAchternaam,
    persoon.achternaam,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    persoon && {
      ...persoon,
      naam,
      adres: [persoon.postcode, persoon.huisnummer].filter(Boolean).join(" "),
    }
  );
}

const router = useRouter();

const result = computed(() => {
  const [bsn, klantData, persoonData] = getEnrichedData();

  const create = async () => {
    try {
      if (!bsn) return;
      dialog.value?.showModal();
      const newKlant = await ensureKlantForBsn(bsn);
      const url = getKlantUrl(newKlant);
      router.push(url);
    } finally {
      dialog.value?.close();
    }
  };

  const klant = mapServiceData(klantData, mapKlant);
  const persoon = mapServiceData(persoonData, mapPersoon);

  return {
    bsn,
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
