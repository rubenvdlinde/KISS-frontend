<template>
  <section class="grid">
    <section>
      <!-- zoeken op geboortedatum wordt nog niet ondersteund in de api, daarom tijdelijk disabled -->
      <!-- <form @submit.prevent="zoekOpNaam">
        <label for="achternaam" class="utrecht-form-label">Achternaam</label>

        <input
          type="text"
          id="achternaam"
          v-model="achternaam"
          class="utrecht-textbox utrecht-textbox--html-input"
          @keydown.enter.prevent="zoekOpNaam"
        />
        <label for="geboortedatum" class="utrecht-form-label"
          >Geboortedatum</label
        >
        <input
          type="text"
          id="geboortedatum"
          v-model="geboortedatum"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpNaam"
        />

        <menu>
          <utrecht-button modelValue type="submit">Zoek</utrecht-button>
        </menu>
      </form> -->

      <form @submit.prevent="zoekOpAdres">
        <label for="postcode" class="utrecht-form-label">Postcode</label>
        <input
          type="text"
          id="postcode"
          v-model="postcode"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpAdres"
          placeholder="3077AW"
        />
        <label for="huisnummer" class="utrecht-form-label">Huisnummer</label>
        <input
          type="text"
          id="huisnummer"
          v-model="huisnummer"
          class="utrecht-textbox utrecht-textbox--html-input"
          v-on:keydown.enter.prevent="zoekOpAdres"
          placeholder="31"
        />

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

      <table v-else-if="personen.length > 0">
        <thead>
          <th>voornamen</th>
          <th>voorvoegsel</th>
          <th>achternamen</th>
          <th>leeftijd</th>
          <th>bsn</th>
          <th></th>
        </thead>
        <tbody>
          <tr v-for="persoon in personen" :key="persoon.id">
            <td>{{ persoon.voornamen }}</td>
            <td>{{ persoon.voorvoegsel }}</td>
            <td>{{ persoon.achternaam }}</td>
            <td>{{ persoon.leeftijd }}</td>
            <td>{{ persoon.bsn }}</td>
            <td>
              <utrecht-button
                class="button-small"
                modelValue
                type="submit"
                @click.prevent="findzaken(persoon.bsn)"
                >Toon zaken</utrecht-button
              >
            </td>
          </tr>
        </tbody>
      </table>

      <simple-spinner v-else-if="busy"></simple-spinner>

      <paragraph v-else-if="isDirty">Er zijn geen personen gevonden.</paragraph>
    </section>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useBrpService } from "./service";
import type { Persoon } from "./types";
import SimpleSpinner from "@/components/SimpleSpinner.vue";
import Paragraph from "@/nl-design-system/components/Paragraph.vue";
import ApplicationMessage from "@/components/ApplicationMessage.vue";
import { UtrechtButton } from "@utrecht/web-component-library-vue";

const emit = defineEmits(["zakenZoeken"]);

const service = useBrpService();
// const achternaam = ref();
// const geboortedatum = ref();
const postcode = ref();
const huisnummer = ref();
const error = ref(false);
const busy = ref(false);
const isDirty = ref(false);
const personen = ref<Persoon[]>([]);

// const zoekOpNaam = () => {
//   //validate input

//   if (!achternaam.value || achternaam.value.length < 2) {
//     alert("achternaam minimaal 2 karakters");
//     return;
//   }

//   if (!geboortedatum.value) {
//     alert("geboortedatum is verplicht");
//     return;
//   }

//   busy.value = true;
//   error.value = false;
//   personen.value = [];

//   // zoeken op geboortedatum wordt nog niet ondersteund in de api, daarom tijdelijk disabled
//   service
//     .findByNameAndBirthDay(achternaam.value, geboortedatum.value)
//     .then((data) => {
//       console.log(data);
//       personen.value = data;
//       isDirty.value = true;
//     })
//     .catch(() => {
//       error.value = true;
//     })
//     .finally(() => {
//       busy.value = false;
//     });
// };

const zoekOpAdres = () => {
  //validate input

  if (!postcode.value) {
    alert("postcode is verplicht");
    return;
  }

  if (!huisnummer.value) {
    alert("huisnummer is verplicht");
    return;
  }

  //sanatize input

  postcode.value = postcode.value.replace(/\s+/g, "").toUpperCase();

  busy.value = true;
  error.value = false;
  personen.value = [];

  service
    .findByPostalcodeAndHouseNumber(postcode.value, huisnummer.value)
    .then((data) => {
      console.log(data);
      personen.value = data;
      isDirty.value = true;
    })
    .catch(() => {
      error.value = true;
    })
    .finally(() => {
      busy.value = false;
    });
};

//test bsn: 205827123
const findzaken = (bsn: number) => {
  emit("zakenZoeken", bsn);
};
</script>

<style lang="scss" scoped>
@import "@utrecht/component-library-css";

.grid {
  display: grid;
  grid-template-columns: 1fr 4fr;

  gap: var(--spacing-large);
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

th,
td {
  padding-top: var(--spacing-small);
  padding-bottom: var(--spacing-small);
  padding-left: var(--spacing-small);
  padding-right: var(--spacing-small);
}

th {
  text-align: left;
}
</style>
