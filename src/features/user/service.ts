import { ServiceResult } from "@/services";
import { computed } from "vue";

function fetchUserRoles(url: string) {
  console.warn("cookie:" + document.cookie);
  return fetch(url, {
    credentials: "include",
  })
    .then((r) => {
      if (!r.ok) throw new Error();
      return r.json();
    })
    .then((json) => {
      if (!json.data?.roles?.length)
        throw new Error(
          "Gebruiker is niet ingelogd of heeft geen rollen. json: " + json
        );
      return json.data.roles as string[];
    });
}

export function useCurrentUserRoles() {
  const state = ServiceResult.fromFetcher(
    window.gatewayBaseUri + "/me",
    fetchUserRoles
  );
  const roles = computed(() => (state.success ? state.data : []));
  return roles;
}
