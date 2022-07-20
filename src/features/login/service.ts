import { ServiceResult } from "@/services";
import { meUrl } from "./config";

const anonymousUser = Object.freeze({
  isLoggedIn: false,
});

async function fetchUser(url: string): Promise<User> {
  const response = await fetch(url, {
    credentials: "include",
  });

  if (response.status === 401) return anonymousUser;

  if (!response.ok) {
    throw new Error("unexpected status code: " + response.status);
  }

  const json = await response.json();

  const roles = json?.roles;
  const id = json?.id;
  if (typeof id !== "string" || !id) return anonymousUser;

  return {
    isLoggedIn: true,
    roles: Array.isArray(roles) ? roles : [],
    id,
  };
}

export const useCurrentUser = () => ServiceResult.fromFetcher(meUrl, fetchUser);
