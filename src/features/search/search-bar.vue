<template>
  <form
    action="/search"
    method="get"
    enctype="application/x-www-form-urlencoded"
    @submit.prevent="submit"
  >
    <label><input type="search" name="q" placeholder="Zoeken" />Zoekterm</label>
    <button><span>Zoeken</span><utrecht-icon-loupe /></button>
  </form>
</template>

<script lang="ts" setup>
import { UtrechtIconLoupe } from "@utrecht/web-component-library-vue";
function submit() {}
</script>

<style lang="scss" scoped>
form {
  display: grid;
  grid-template-columns: 1fr min-content;
  align-items: stretch;
  justify-content: center;
  border-radius: 1.5rem;
  overflow: hidden;
  width: min(40rem, 100%);
  --utrecht-icon-size: 1rem;
}
label,
button {
  font-size: 0;
}
button {
  background: white;
  border: none;
  padding-inline-end: var(--spacing-default);
}
input {
  padding: 0.5rem;
  padding-inline-start: var(--spacing-default);
  width: 100%;
  border: none;
}
</style>
