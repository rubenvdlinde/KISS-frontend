import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import type { Ref } from "vue";

export type User =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      id: string;
      email: string;
      roles: string[];
    };

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      preferences: useStorage("preferences", { kanaal: "" }) as Ref<{
        kanaal: string;
      }>,
      user: {
        isLoggedIn: false,
      } as User,
    };
  },
  actions: {
    setKanaal(kanaal: string) {
      this.preferences.kanaal = kanaal;
    },
    setUser(user: User) {
      this.user = user;
    },
  },
});
