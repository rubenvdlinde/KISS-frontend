let waiting = false;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForLogin(): Promise<void> {
  if (!waiting) return Promise.resolve();
  return wait(500).then(waitForLogin);
}

export function handleLogin() {
  waiting = false;
}

type FetchArgs = Parameters<typeof fetch>;
type FetchReturn = ReturnType<typeof fetch>;

export function fetchLoggedIn(...args: FetchArgs): FetchReturn {
  const init = args[1];
  if (!init?.credentials) {
    args[1] = {
      ...(init || {}),
      credentials: "include",
    };
  }
  return fetch(...args).then((r) => {
    if (r.status === 401) {
      waiting = true;
      return waitForLogin().then(() => fetchLoggedIn(...args));
    }
    return r;
  });
}
