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
      roles: string[];
    };

enum Roles {
  adminPost = "ROLE_scope.POST.admin",
}

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
  getters: {
    hasAdminPostRole: (state) =>
      state.user.isLoggedIn && state.user.roles.includes(Roles.adminPost),
  },
});
