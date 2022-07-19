import { ServiceResult } from "@/services";

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

const meUrl = window.gatewayBaseUri + "/me";
export const loginUrl = window.gatewayBaseUri + "/login/oidc/dex";
export const logoutUrl = window.gatewayBaseUri + "/logout";

export const useCurrentUser = () => ServiceResult.fromFetcher(meUrl, fetchUser);
