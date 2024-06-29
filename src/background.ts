import { applyIdentity, getIdList, Identity } from "./utils/identity";
function createRootContextMenu(): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  chrome.contextMenus.create(
    {
      id: "ids",
      title: "切换身份",
      contexts: ["all"],
    },
    () => {
      resolve();
    },
  );
  return promise;
}
function createContextMenu(name: string, title: string): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  chrome.contextMenus.create(
    {
      parentId: "ids",
      id: name,
      title: title,
      contexts: ["all"],
    },
    () => {
      resolve();
    },
  );
  return promise;
}
async function setupContextMenu() {
  await createRootContextMenu();
  const idList = await getIdList();
  for (const id of idList) {
    await createContextMenu(id, id);
  }
}

chrome.tabs.onActivated.addListener(() => setupContextMenu());
chrome.storage.onChanged.addListener(() => setupContextMenu());
chrome.runtime.onInstalled.addListener(() => setupContextMenu());
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) {
    return;
  }
  const id = info.menuItemId?.toString();
  const identity = (await chrome.storage.local.get(id))[id] as Identity;
  if (!identity) {
    return;
  }
  await applyIdentity(tab, identity);
});
