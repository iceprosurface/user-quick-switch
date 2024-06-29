export async function getActiveTab() {
  try {
    const tabs = await chrome.tabs.query({
      currentWindow: true,
      active: true,
    });
    return tabs[0];
  } catch (err) {
    console.error("Error occured in getActiveTabURL", err);
  }
}
