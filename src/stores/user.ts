import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      preferences: useStorage("preferences", { kanaal: "" }),
    };
  },
  actions: {
    setKanaal(kanaal) {
      this.preferences.kanaal = kanaal;
    },
  },
});
