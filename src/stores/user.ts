import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { Ref } from "vue";

type Preferences = Ref<{
  kanaal: string;
}>;

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      preferences: useStorage("preferences", { kanaal: "" }) as Preferences,
    };
  },
  actions: {
    setKanaal(kanaal: string) {
      this.preferences.kanaal = kanaal;
    },
  },
});
