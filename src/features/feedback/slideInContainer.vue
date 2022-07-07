<template>
  <aside :class="{ open: isOpen }">
    <menu>
      <!--geen nl design buton: conflicteert met de rotatie-->
      <button @click="toggle">Feedback</button></menu
    >
    <section><slot :close="toggle"></slot></section>
  </aside>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const isOpen = ref(false);
const toggle = () => (isOpen.value = !isOpen.value);
</script>
<style lang="scss" scoped>
@import "@utrecht/component-library-css";

menu {
}
aside {
  z-index: 100;
  position: absolute;
  right: 0rem;
  top: 100px;
  background-color: var(--color-secundary);

  display: grid;
  grid-template-columns: 0 1fr;

  // transition: width 1s ease-in-out;
}

aside.open section {
}

aside.open section {
  display: block;
}

button {
  position: relative;
  top: 10rem;
  right: 3rem;
  background: var(--color-primary);
  color: white;
  border: none;
  z-index: 15;
  height: 3rem;
  display: inline-block;
  transform-origin: top left;
  transform: rotate(-90deg);
  padding: var(--utrecht-button-padding-inline-start)
    var(--utrecht-button-padding-inline-end);

  height: var(--utrecht-button-min-inline-size);
  font-size: var(
    --utrecht-button-font-size,
    var(--utrecht-document-font-family)
  );
}

section {
  border-left: 4px solid var(--color-primary);
  border-bottom: 4px solid var(--color-primary);
  border-top: 4px solid var(--color-primary);
  background-color: var(--color-secondary);
  display: none;
}
</style>
