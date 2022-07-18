import { ServiceResult } from "@/services";
import { computed } from "vue";

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
  admin = "ROLE_scope.POST.admin",
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

export function useHasRole(role: Roles) {
  const user = useCurrentUser();
  return computed(
    () => user.success && user.data.isLoggedIn && user.data.roles.includes(role)
  );
}

export const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";
