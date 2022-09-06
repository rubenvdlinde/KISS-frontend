<template>
  <section class="grid">
    <section>
      <form @submit.prevent="zoekOpZaak">
        <fieldset class="utrecht-form-fieldset">
          <label for="zaaknummer" class="utrecht-form-label">Zaaknummer</label>
          <input
            type="text"
            id="zaaknummer"
            v-model="store.zaakSearchParams.zaaknummer"
            class="utrecht-textbox utrecht-textbox--html-input"
            v-on:keydown.enter.prevent="zoekOpZaak"
          />
        </fieldset>
        <menu>
          <utrecht-button modelValue type="submit">Zoek</utrecht-button>
        </menu>
      </form>

      <form @submit.prevent="zoekOpBsn">
        <fieldset class="utrecht-form-fieldset">
          <label for="bsn" class="utrecht-form-label">Bsn</label>
          <input
            type="text"
            id="bsn"
            v-model="store.zaakSearchParams.bsn"
            class="utrecht-textbox utrecht-textbox--html-input"
            placeholder="205827123"
          />
        </fieldset>
        <menu>
          <utrecht-button modelValue type="submit">Zoek</utrecht-button>
        </menu>
      </form>
    </section>
    <section>
      <application-message
        v-if="error"
        messageType="error"
        message="Er is een probleem opgetreden."
      ></application-message>

      <zaken-overzicht
        v-else-if="store.zaken.length > 0"
        :zaken="store.zaken"
        @zaak-selected="zaakSelected"
      ></zaken-overzicht>

      <simple-spinner v-else-if="busy"></simple-spinner>

      <paragraph v-else-if="isDirty">Er zijn geen zaken gevonden.</paragraph>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { useZaaksysteemService } from "./service";
import type { Zaak } from "@/stores/contactmoment";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";
import ZakenOverzicht from "./ZakenOverzicht.vue";
import { getStore } from "@/stores/create-store"; //todo: niet in de stores map. die is applicatie specifiek. dit is generieke functionaliteit

const props = defineProps({
  populatedBsn: { type: String, default: null },
});

const store = getStore({
  storeId: "zaak-zoeker",
  stateFactory() {
    return {
      zaakSearchParams: { zaaknummer: "", bsn: "" },
      zaken: [] as Zaak[],
    };
  },
});

const emit = defineEmits(["zaakSelected"]);

const zaakSelected = (zaak: Zaak) => {
  emit("zaakSelected", zaak);
};

const service = useZaaksysteemService();

const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);

const zoekOpZaak = () => {
  busy.value = true;
  error.value = false;
  store.value.zaken = [];

  service
    .findByZaak(store.value.zaakSearchParams.zaaknummer)
    .then((data) => {
      store.value.zaken = data.page;
      isDirty.value = true;
    })
    .catch((e) => {
      error.value = true;
      console.error(e);
    })
    .finally(() => {
      busy.value = false;
    });
};

const zoekOpBsn = () => {
  busy.value = true;
  error.value = false;
  store.value.zaken = [];

  service
    .findByBsn(store.value.zaakSearchParams.bsn)
    .withoutFetcher()
    .then((data) => {
      store.value.zaken = data.page;
      isDirty.value = true;
    })
    .catch((e) => {
      error.value = true;
      console.error(e);
    })
    .finally(() => {
      busy.value = false;
    });
};

//als er een bsn meegegeven wordt dan initieren we direct een zoekopdracht daarop
watch(
  () => props.populatedBsn,
  (populatedBsnValue) => {
    if (populatedBsnValue) {
      store.value.zaakSearchParams.bsn = populatedBsnValue;
      zoekOpBsn();
    }
  },
  { immediate: true }
);

const singleZaak = computed(() =>
  store.value.zaken && store.value.zaken.length === 1
    ? store.value.zaken[0]
    : undefined
);

watch(singleZaak, (n, o) => {
  if (n && n.id !== o?.id) {
    zaakSelected(n);
  }
});
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

.grid {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-gap: 2rem;
}

label {
  display: inline-block;
  margin-top: var(--spacing-default);
}

input {
  margin-top: var(--spacing-small);
}

menu {
  margin-top: var(--spacing-large);
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
