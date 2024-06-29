import { getActiveTab } from "./getActiveTab";
import {
  getDomainStorageData,
  getDomainStorageDataRecordByKeys,
  setDomainStorageData,
} from "./domainStorageData";

export async function getStorageOnTab(type: "local" | "session") {
  const activeTab = await getActiveTab();
  const tabId = activeTab?.id;
  if (!tabId) {
    return Promise.reject("No active tab found");
  }
  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId },
    func: getDomainStorageData,
    args: [type],
  });
  try {
    return injectionResults[0]?.result || [];
  } catch (err) {
    console.error("Error occurred in injectionResults", err);
  }
}
export async function getStorageOnTabByKeys(
  type: "local" | "session",
  keys: string[],
) {
  const activeTab = await getActiveTab();
  const tabId = activeTab?.id;
  if (!tabId) {
    return Promise.reject("No active tab found");
  }
  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId },
    func: getDomainStorageDataRecordByKeys,
    args: [type, keys],
  });
  try {
    return injectionResults[0]?.result;
  } catch (err) {
    console.error("Error occurred in injectionResults", err);
  }
}

export async function setStorageOnTab(
  type: "local" | "session",
  record: Record<string, string>,
) {
  const activeTab = await getActiveTab();
  const tabId = activeTab?.id;
  if (!tabId) {
    return Promise.reject("No active tab found");
  }
  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId },
    func: setDomainStorageData,
    args: [type, record],
  });
  try {
    return injectionResults[0]?.result;
  } catch (err) {
    console.error("Error occurred in injectionResults", err);
  }
}
