import { createEffect, createSignal, Match, Switch } from "solid-js";
import { TabStorage } from "./components";
import { SettingPage } from "./components/SettingPage";
import { getActiveTab } from "./utils/getActiveTab";
const enum Tab {
  Storage = "storage",
  Settings = "settings",
}
async function requestPermission() {
  const activeTab = await getActiveTab();
  if (!activeTab || !activeTab.url) {
    return Promise.resolve(false);
  }
  const { promise, resolve } = Promise.withResolvers<boolean>();
  chrome.permissions.request(
    {
      permissions: ["cookies", "tabs", "storage", "scripting", "contextMenus"],
      origins: [new URL(activeTab.url).origin],
    },
    (granted) => {
      if (granted) {
        resolve(true);
      } else {
        resolve(false);
      }
    },
  );
  return promise;
}
export function App() {
  const [currentTab, setCurrentTab] = createSignal<Tab>(Tab.Storage);
  const [hasPermission, setHasPermission] = createSignal<boolean>(false);
  createEffect(() => {
    requestPermission().then(setHasPermission);
  });
  return (
    <div class="h-full">
      <Switch>
        <Match when={currentTab() === "storage"}>
          <TabStorage gotoSettings={() => setCurrentTab(Tab.Settings)} />
        </Match>
        <Match when={currentTab() === "settings"}>
          <SettingPage goBackStorage={() => setCurrentTab(Tab.Storage)} />
        </Match>
      </Switch>
    </div>
  );
}
