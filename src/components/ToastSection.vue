<template>
  <!-- https://web.dev/building-a-toast-component/ -->
  <section>
    <output
      v-for="({ message, type, show }, i) in messages"
      :key="i"
      role="status"
      :class="[type, { show }]"
      >{{ message }}</output
    >
  </section>
</template>

<script lang="ts" setup>
import { nextTick, reactive } from "vue";
type Message = {
  message: string;
  type: "confirm" | "error";
};

const messages = reactive<(Message & { show: boolean })[]>([]);

function pushMessage(message: Message) {
  const m = reactive({
    ...message,
    show: false,
  });
  messages.unshift(m);
  nextTick(() => {
    m.show = true;
  });
  setTimeout(() => {
    m.show = false;
    setTimeout(() => {
      const index = messages.indexOf(m);
      if (index !== -1) {
        messages.splice(index, 1);
      }
    }, 1000);
  }, 3000);
}

setInterval(() => {
  pushMessage({
    message: "Item added to cart",
    type: "confirm",
  });
}, 6000);
</script>

<style scoped lang="scss">
section {
  position: fixed;
  z-index: 1;
  inset-block-end: 0;
  inset-inline: 0;
  padding-block-end: 5vh;
  display: grid;
  justify-items: center;
  justify-content: center;
  gap: 1vh;
  pointer-events: none;
}

output {
  max-inline-size: min(25ch, 90vw);
  padding: var(--spacing-default);
  border-radius: var(--radius-default);
  font-size: 1rem;
  color: white;
  opacity: 0;
  transition: opacity 500ms ease;

  &.show {
    opacity: 100;
  }
}

.confirm {
  background-color: var(--color-accent);
}
</style>
