import { createSignal, Match, Switch } from "solid-js";
import { TabStorage } from "./components";
import { SettingPage } from "./components/SettingPage";
const enum Tab {
  Storage = "storage",
  Settings = "settings",
}
export function App() {
  const [currentTab, setCurrentTab] = createSignal<Tab>(Tab.Storage);
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
