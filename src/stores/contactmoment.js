import { defineStore } from "pinia";
export const useContactmomentStore = defineStore("contactmoment", {
  state: () => {
    return { contactmomentLoopt: false };
  }, 
  actions: {
    start() {
      this.contactmomentLoopt = true;
    },
    stop() {
      this.contactmomentLoopt = false;
    },
  },
});
