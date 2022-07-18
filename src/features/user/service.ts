import { ServiceResult, type ServiceData } from "@/services";
import { handleLoginChange } from "@/services/wait-for-login";
import { watch } from "vue";

export type User =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      id: string;
      roles: string[];
    };

export enum Roles {
  adminPost = "ROLE_scope.POST.admin",
}

function fetchUser(url: string): Promise<User> {
  return fetch(url, {
    credentials: "include",
  })
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((json) => {
      const roles = json?.roles;
      const id = json?.id;
      if (typeof id !== "string" || !id)
        return {
          isLoggedIn: false,
        };
      return {
        isLoggedIn: true,
        roles: Array.isArray(roles) ? roles : [],
        id,
      };
    });
}

export const useCurrentUser = () =>
  ServiceResult.fromFetcher(window.gatewayBaseUri + "/me", fetchUser);

const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";

export function ensureLoggedIn() {
  const currentUser = useCurrentUser();
  watch(currentUser, (u) => {
    if (u.loading) {
      return;
    }
    handleLoginChange(u.success && u.data.isLoggedIn, loginUrl);
  });

  return currentUser as ServiceData<void>;
}

export const logoutUrl = window.gatewayBaseUri + "/logout";
