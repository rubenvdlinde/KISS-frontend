<template>
  <textarea
    ref="notitieRef"
    v-if="contactmomentStore.huidigeVraag"
    @change="notitieChanged"
    v-model="contactmomentStore.huidigeVraag.notitie"
    placeholder="Voeg hier je notities toe"
  >
  </textarea>
</template>
