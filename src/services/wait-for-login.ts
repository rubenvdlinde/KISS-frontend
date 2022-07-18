const CLOSE_TAB_CHANNEL_NAME = "closeTabChannel";
const NEW_TAB_PARAM = "newTab";
const closeTabChannel = new BroadcastChannel(CLOSE_TAB_CHANNEL_NAME);

export function closeCurrentTab() {
  closeTabChannel.postMessage("close");
}

let newTab: Window | null = null;
const state = {
  isLoggedIn: false,
};

closeTabChannel.onmessage = () => {
  if (newTab) {
    newTab.close();
    newTab = null;
  }
};

function openWindow() {
  if (!newTab || newTab.closed) {
    const url = new URL(window.location.href);
    newTab = window.open(url, "_blank");
    if (newTab) {
      (newTab as any).isNewTab = true;
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForLogin(): Promise<void> {
  if (!newTab) return Promise.resolve();
  return wait(500).then(waitForLogin);
}

type FetchArgs = Parameters<typeof fetch>;
type FetchReturn = ReturnType<typeof fetch>;

export function handleLoginChange(isLoggedIn: boolean, loginUrl: string) {
  state.isLoggedIn = isLoggedIn;
  const isNewTab = !!(window as any).isNewTab;
  if (!isNewTab) return;
  if (!isLoggedIn) {
    document.location.href = loginUrl;
    return;
  }
  if (isLoggedIn) {
    closeTabChannel.postMessage("close");
    const p = document.createElement("p");
    p.innerText = "u bent ingelogd. u kunt deze tab sluiten.";
    document.body = p;
  }
}

export function fetchLoggedIn(...args: FetchArgs): FetchReturn {
  const init = args[1];
  if (!init?.credentials) {
    args[1] = {
      ...(init || {}),
      credentials: "include",
    };
  }
  return fetch(...args).then((r) => {
    let is401 = r.status === 401;
    is401 = Math.random() > 0.75;
    if (is401 && !state.isLoggedIn && document.hasFocus()) {
      openWindow();
      return waitForLogin().then(() => fetchLoggedIn(...args));
    }
    return r;
  });
}
