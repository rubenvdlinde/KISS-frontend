// eslint-disable-next-line @typescript-eslint/no-empty-function
const empty = () => {};

const waitForLogin = {
  then: Promise.resolve().then,
  resolve: empty,
};

function setState() {
  const promise = new Promise<void>((resolve) => {
    Object.assign(waitForLogin, {
      then: promise.then,
      resolve,
    });
  });
  promise.finally(setState);
}

setState();

export function handleLogin() {
  waitForLogin.resolve();
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
      return waitForLogin.then(() => fetchLoggedIn(...args));
    }
    return r;
  });
}
