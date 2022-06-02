<template>
  <div class="modal-layout">
    <div class="modal">
      <div>
        <slot name="message"></slot>
      </div>
      <menu>
        <slot name="menu"></slot>
      </menu>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border: 1px solid var(--color-primary);
  z-index: 10;
  border-radius: var(--radius-default);
}
.modal-layout {
  z-index: 20;
  left: 0;
  top: 0;
  position: fixed;
  background-color: #666666cc;
  width: 100%;
  height: 100%;
}
menu {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
