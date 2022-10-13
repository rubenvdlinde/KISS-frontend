<template>
  <tr class="row-link">
    <template v-if="result.klant.success">
      <th scope="row" class="wrap">
        {{ result.klant.data?.naam }}
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
        <time
          v-if="result.persoon.data?.geboortedatum"
          :datetime="result.persoon.data.geboortedatum.datetime"
        >
          {{ result.persoon.data.geboortedatum.label }}
        </time>
      </td>
      <td>{{ result.persoon.data?.adres }}</td>
    </template>
    <td colspan="2" v-else>
      <simple-spinner class="spinner" v-if="result.persoon.loading" />
    </td>
    <td>
      <router-link
        v-if="result.klant.success && result.klant.data?.link"
        v-bind="result.klant.data.link"
      />
      <button
        type="button"
        v-else-if="result.klant.success"
        @click="result.create()"
      >
        Aanmaken
      </button>
    </td>
  </tr>
</template>
<script lang="ts" setup>
import { formatDateOnly } from "@/helpers/date";
import { ServiceResult } from "@/services";
import { computed } from "vue";
import { ensureKlant, useKlantByBsn } from "./service";
import type { Klant, Persoon } from "./types";
import SimpleSpinner from "../../components/SimpleSpinner.vue";
import { useRouter } from "vue-router";
import { usePersoonByBsn } from "./brp/service";

const props = defineProps<{ record: Klant | Persoon }>();
const klantBsn = computed(() =>
  props.record._brand !== "klant" || !props.record.bsn ? "" : props.record.bsn
);
const persoonBsn = computed(() =>
  props.record._brand !== "persoon" || !props.record.bsn ? "" : props.record.bsn
);

const enrichtedPersoon = usePersoonByBsn(klantBsn);
const enrichedKlant = useKlantByBsn(persoonBsn);

const getKlantUrl = (klant: Klant) => `/klanten/${klant.id}`;

function mapKlant(klant: Klant) {
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

function getKlant() {
  if (props.record._brand === "klant")
    return ServiceResult.success(mapKlant(props.record));
  if (!props.record.bsn) return ServiceResult.success(undefined);
  if (!enrichedKlant.success) return enrichedKlant;
  return {
    ...enrichedKlant,
    data: enrichedKlant.data && mapKlant(enrichedKlant.data),
  };
}

function mapPersoon(persoon: Persoon) {
  return {
    ...persoon,
    geboortedatum: persoon.geboortedatum && {
      label: formatDateOnly(persoon.geboortedatum),
      datetime: persoon.geboortedatum.toISOString().substring(0, 10),
    },
    adres: [persoon.postcode, persoon.huisnummer].filter(Boolean).join(" "),
  };
}

function getPersoon() {
  if (props.record._brand === "persoon")
    return ServiceResult.success(mapPersoon(props.record));
  if (!props.record.bsn) return ServiceResult.success(undefined);
  if (!enrichtedPersoon.success) return enrichtedPersoon;
  return {
    ...enrichtedPersoon,
    data: enrichtedPersoon.data && mapPersoon(enrichtedPersoon.data),
  };
}

const router = useRouter();

const result = computed(() => {
  const bsn = klantBsn.value || persoonBsn.value;
  const klant = getKlant();
  const create = async () => {
    if (!bsn || !klant.success || !!klant.data?.id) return;
    const newKlant = await ensureKlant(bsn);
    const url = getKlantUrl(newKlant);
    router.push(url);
  };

  return {
    bsn,
    klant: klant,
    persoon: getPersoon(),
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
</style>
