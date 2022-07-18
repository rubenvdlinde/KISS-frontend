import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
import { useCurrentUser, Roles } from "@/features/user";

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      preferences: useStorage("preferences", { kanaal: "" }),
      userData: useCurrentUser(),
    };
  },
  actions: {
    setKanaal(kanaal) {
      this.preferences.kanaal = kanaal;
    },
  },
  getters: {
    hasAdminPostRole(state) {
      return (
        state.userData.success &&
        state.userData.data.isLoggedIn &&
        state.userData.data.roles.includes(Roles.adminPost)
      );
    },
  },
});
