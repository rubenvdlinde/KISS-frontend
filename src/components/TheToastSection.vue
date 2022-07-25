<template>
  <!-- https://web.dev/building-a-toast-component/ -->
  <transition-group name="toast">
    <section>
      <output
        v-for="({ message, type }, key) in messages"
        :key="key"
        role="status"
        :class="type"
        >{{ message }}</output
      >
    </section>
  </transition-group>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
type Message = {
  message: string;
  type: "confirm" | "error";
};

const messages = reactive<Message[]>([]);

function pushMessage(m: Message) {
  messages.push(m);
  setTimeout(() => {
    const index = messages.indexOf(m);
    if (index !== -1) {
      messages.splice(index, 1);
    }
  }, 3000);
}

setInterval(() => {
  pushMessage({
    message: Math.random().toString(),
    type: "confirm",
  });
}, 2000);
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
}

.confirm {
  background-color: var(--color-accent);
}

.toast-move, /* apply transition to moving elements */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  // transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.toast-leave-active {
  position: absolute;
}
</style>
