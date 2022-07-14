import { ServiceResult } from "@/services";
import { watchEffect } from "vue";

function fetchUser(url: string) {
  console.warn("cookie:" + document.cookie);
  return fetch(url, {
    credentials: "include",
  }).then((r) => {
    if (!r.ok) throw new Error();
    return r.json();
  });
}

export function useLoggedinUser() {
  const result = ServiceResult.fromFetcher(
    window.gatewayBaseUri + "/me",
    fetchUser
  );
  const dispose = watchEffect(() => {
    if (result.error || (result.success && !result.data?.roles?.length)) {
      dispose();
      // document.location.href = window.gatewayBaseUri + "/login/oidc/dex";
    }
  });
  return result;
}
