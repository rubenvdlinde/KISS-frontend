<template>


  <form
 
           
          class="search-bar"
           @submit.prevent="handleSearch"
        >

 <label for="searchInput"
            ><span>Klanten zoeken</span>
            <input
              type="search"
              name="search"
              id="searchInput"
              placeholder="Zoek op e-mailadres of telefoonnummer"
              @search.prevent="handleSearch"
              v-model="searchQuery"
          /></label>
          <button title="Zoeken">
            <span>Zoeken</span><utrecht-icon-loupe model-value />
          </button>
{{serviceResult?.state}}
</form>

  <p>klantzoeker...</p>

  <p>
    in het klant-zoek-component zoek je obv email of telnr via /api/klanten<br />
    (https://redocly.github.io/redoc/?nocors&url=https://kissdevelopment-dimpact.commonground.nu/openapi.json#tag/Klanten-collection/operation/Klant_getId).<br />
    als er niemand gevonden wordt een melding tonen. als er meerdere
    resultaten<br />
    zijn een lijst tonen als er 1 resultaat direct de details tonen. nog
    bepalen<br />
    hoe om te gaan met zeer groot aantal resultaten<br />

    van de resultaten tonen we : "voornaam": "string", "voorvoegselAchternaam":
    "string", "achternaam": "string", "telefoonnummer": "string", "emailadres":
    "example@hotmail.com" "klantnummer": "string",

    todo: <br/>
    loding en error states afhandelen<br/>
    zoeken op telnr<br/>
    validatie op input format en lengte<br/>

  </p>
</template>


<script lang="ts" setup>

import type { ServiceData } from "@/services";
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
import { ref } from "vue";
import { useKlantService } from "./service";
import type { Klant } from "./types";

const searchQuery  = ref('');
const service  = useKlantService();
const serviceResult = ref<ServiceData<Klant>>();

const handleSearch = ()=> {

   const result = service.searchByEmail(searchQuery.value);
  serviceResult.value = result.state;


   
}

</script>

<style lang="scss" scoped>
input {
  width  : var(--section-width);
}
</style>
