import { getActiveTab } from "./getActiveTab";

export async function getTabCookie() {
  const activeTab = await getActiveTab();
  const { resolve, reject, promise } = Promise.withResolvers<string[]>();
  if (!activeTab || !activeTab.url) {
    reject("No active tab found");
    return promise;
  }
  const url = new URL(activeTab.url);
  chrome.cookies.getAll(
    {
      url: url.origin,
    },
    (cookies) => {
      resolve(cookies.map((cookie) => cookie.name));
    },
  );
  return promise;
}

export async function getTabCookiesByKeys(keys: string[]) {
  const activeTab = await getActiveTab();
  const { resolve, reject, promise } =
    Promise.withResolvers<chrome.cookies.Cookie[]>();
  if (!activeTab || !activeTab.url) {
    reject("No active tab found");
    return promise;
  }
  const url = new URL(activeTab.url);
  chrome.cookies.getAll(
    {
      url: url.origin,
    },
    (cookies) => {
      resolve(cookies.filter((cookie) => keys.includes(cookie.name)));
    },
  );
  return promise;
}
