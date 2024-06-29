import { applyIdentity, getIdList, Identity } from "./utils/identity";

function removeContext(name: string): Promise<void> {
  return new Promise((resolve) => {
    chrome.contextMenus.remove(name, () => {
      resolve();
    });
  });
}
function createRootContextMenu(): Promise<void> {
  return new Promise((resolve) => {
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
  });
}
function createContextMenu(name: string, title: string): Promise<void> {
  return new Promise((resolve) => {
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
  });
}
async function setupContextMenu() {
  // current tab
  await removeContext("ids");
  await createRootContextMenu();
  const idList = await getIdList();
  for (const id of idList) {
    await createContextMenu(id, id);
  }
}
chrome.tabs.onActivated.addListener(async () => {
  await setupContextMenu();
});
chrome.storage.onChanged.addListener(async () => {
  await setupContextMenu();
});
chrome.runtime.onInstalled.addListener(async () => {
  await setupContextMenu();
});
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab) {
    return;
  }
  const id = info.menuItemId?.toString();
  const identity = (await chrome.storage.local.get(id))[id] as Identity;
  console.log("identity", identity);
  if (!identity) {
    return;
  }
  await applyIdentity(tab, identity);
});