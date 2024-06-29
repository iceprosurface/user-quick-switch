import { setStorageOnTab } from "./storageOnTab";

export type Identity = {
  cookie: chrome.cookies.Cookie[];
  storage: {
    local: Record<string, string>;
    session: Record<string, string>;
  };
  id: string;
};
export async function saveIdentity(identity: Identity) {
  await chrome.storage.local.set({ [identity.id]: identity });
}

export async function applyIdentity(tab: chrome.tabs.Tab, identity: Identity) {
  await Promise.all(
    identity.cookie.map(async (cookie) => {
      await chrome.cookies.set({
        domain: cookie.domain,
        name: cookie.name,
        value: cookie.value,
        url: `https://${cookie.domain}`,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
      });
    }),
  );
  await setStorageOnTab("local", identity.storage.local);
  await setStorageOnTab("session", identity.storage.session);
  await chrome.tabs.reload();
}

export async function getIdList(): Promise<string[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      resolve(Object.keys(items));
    });
  });
}
