import { Button } from "@kobalte/core/button";
import { Tabs } from "@kobalte/core/tabs";
import { TextField } from "@kobalte/core/text-field";
import "./component.css";
import { AiOutlineSetting } from "solid-icons/ai";
import { createEffect, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import {
  getStorageOnTab,
  getStorageOnTabByKeys,
  getTabCookie,
  getTabCookiesByKeys,
} from "../utils";
import { Identity, saveIdentity } from "../utils/identity";
import { StorageList } from "./StorageList";
import { useSuccessToast } from "./toast";
import { useStorageState } from "./UseStorageState";

function useStorage() {
  const localStorageState = useStorageState();
  const sessionStorageState = useStorageState();
  const cookiesStorageState = useStorageState();
  createEffect(async () => {
    const local = await getStorageOnTab("local");
    localStorageState.setStorageValues(local);
    const session = await getStorageOnTab("session");
    sessionStorageState.setStorageValues(session);
    const cookies = await getTabCookie();
    cookiesStorageState.setStorageValues(cookies);
  });
  return {
    localStorageState,
    sessionStorageState,
    cookiesStorageState,
    async getStorage() {
      const [localStorageRecord, sessionStorageRecord, cookies] =
        await Promise.all([
          getStorageOnTabByKeys("local", localStorageState.selected()),
          getStorageOnTabByKeys("session", sessionStorageState.selected()),
          getTabCookiesByKeys(cookiesStorageState.selected()),
        ]);
      return {
        localStorageRecord,
        sessionStorageRecord,
        cookies,
      };
    },
  };
}
export function TabStorage(props: { gotoSettings: () => void }) {
  const {
    localStorageState,
    sessionStorageState,
    cookiesStorageState,
    getStorage,
  } = useStorage();
  const [name, setName] = createSignal<string>("");
  const { showSuccessToast, Toast } = useSuccessToast();

  async function saveAsIdentity() {
    if (!name()) return;
    const { localStorageRecord, sessionStorageRecord, cookies } =
      await getStorage();
    if (!localStorageRecord || !sessionStorageRecord || !cookies) return;
    const identity: Identity = {
      cookie: cookies,
      storage: { local: localStorageRecord, session: sessionStorageRecord },
      id: name(),
    };
    await saveIdentity(identity);
    showSuccessToast(identity.id);
  }
  return (
    <div class="flex flex-col h-full divide-y">
      <div class="flex-1 overflow-hidden">
        <Tabs aria-label="Main navigation" class="tabs overflow-hidden h-full">
          <Tabs.List class="tabs__list">
            <Tabs.Trigger class="tabs__trigger" value="1">
              cookies{cookiesStorageState.label()}
            </Tabs.Trigger>
            <Tabs.Trigger class="tabs__trigger" value="2">
              local storage{localStorageState.label()}
            </Tabs.Trigger>
            <Tabs.Trigger class="tabs__trigger" value="3">
              session storage{sessionStorageState.label()}
            </Tabs.Trigger>
            <Tabs.Indicator class="tabs__indicator" />
          </Tabs.List>
          <Tabs.Content
            class="tabs__content  overflow-x-hidden overflow-y-auto"
            value="1"
          >
            <StorageList storageState={cookiesStorageState} />
          </Tabs.Content>
          <Tabs.Content
            class="tabs__content  overflow-x-hidden overflow-y-auto"
            value="2"
          >
            <StorageList storageState={localStorageState} />
          </Tabs.Content>
          <Tabs.Content
            class="tabs__content  overflow-x-hidden overflow-y-auto"
            value="3"
          >
            <StorageList storageState={sessionStorageState} />
          </Tabs.Content>
        </Tabs>
      </div>
      <div class="p-2">
        <div class=""></div>
        <div class="flex justify-between items-end">
          <TextField class="text-field">
            <TextField.Label class="text-field__label">
              身份名称
            </TextField.Label>
            <TextField.Input
              class="text-field__input"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
            />
          </TextField>
          <Button class={"button"} onClick={() => saveAsIdentity()}>
            储存为身份
          </Button>
          <div
            class="flex items-center mx-1"
            style="height: 32px"
            onClick={() => props.gotoSettings()}
          >
            <AiOutlineSetting size={22} class="text-slate-600 cursor-pointer" />
          </div>
        </div>
      </div>
      <Portal>
        <Toast.Region>
          <Toast.List class="toast__list" />
        </Toast.Region>
      </Portal>
    </div>
  );
}
