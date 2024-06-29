import { Collapsible } from "@kobalte/core/collapsible";
import { AiOutlineLeft, AiOutlineDown, AiFillDelete } from "solid-icons/ai";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { getIdList, Identity } from "../utils/identity";
function IdentityDetailItem(props: {
  item: { key: string; value: string }[];
  title: string;
}) {
  return (
    <div>
      <Show when={props.item.length !== 0} fallback={<div />}>
        <table class="table-fixed w-full">
          <thead>
            <tr>
              <th colspan="2" class="text-left">
                {props.title}
              </th>
            </tr>
          </thead>
          <tbody>
            <For each={props.item}>
              {(item) => (
                <tr>
                  <td>{item.key}</td>
                  <td class="truncate" title={item.value}>
                    {item.value}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      </Show>
    </div>
  );
}
function IdentityDetail(props: { id: string; deleteId: (id: string) => void }) {
  const [identity, setIdentity] = createSignal<Identity>({
    cookie: [],
    storage: {
      local: {},
      session: {},
    },
    id: props.id,
  });
  createEffect(async () => {
    const id = props.id;
    const identity = (await chrome.storage.local.get(id))[id] as Identity;
    setIdentity(identity);
  });
  const cookies = createMemo(() =>
    identity().cookie.map((cookie) => ({
      key: cookie.name,
      value: cookie.value,
    })),
  );
  function mapRecordToItem(record: Record<string, string>) {
    return Object.entries(record).map(([key, value]) => ({ key, value }));
  }
  const local = createMemo(() => mapRecordToItem(identity().storage.local));
  const session = createMemo(() => mapRecordToItem(identity().storage.session));
  return (
    <Collapsible class="collapsible">
      <Collapsible.Trigger class="collapsible__trigger">
        <span>{props.id}</span>
        <div class="flex gap-2">
          <div
            class="px-2 cursor-pointer"
            onClick={() => props.deleteId(props.id)}
          >
            <AiFillDelete size={20} />
          </div>
          <AiOutlineDown class="collapsible__trigger-icon" />
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content class="collapsible__content">
        <div>
          <IdentityDetailItem item={cookies()} title="cookie" />
          <IdentityDetailItem item={local()} title="local storage" />
          <IdentityDetailItem item={session()} title="session storage" />
        </div>
      </Collapsible.Content>
    </Collapsible>
  );
}

export function SettingPage(props: { goBackStorage: () => void }) {
  //
  const [ids, setIds] = createSignal<string[]>([]);
  createEffect(async () => {
    const idList = await getIdList();
    setIds(idList);
  });

  async function deleteId(id: string) {
    await chrome.storage.local.remove(id);
    setIds((current) => current.filter((v) => v !== id));
  }

  return (
    <div class="h-full flex flex-col  divide-y">
      <h3
        class="flex items-center gap-1 px-2 py-2 cursor-pointer"
        onClick={() => props.goBackStorage()}
      >
        <AiOutlineLeft size={22} />
        <span class="text-lg">设置页面</span>
      </h3>
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <For each={ids()}>
          {(id) => <IdentityDetail id={id} deleteId={(id) => deleteId(id)} />}
        </For>
      </div>
    </div>
  );
}
