import { Checkbox } from "@kobalte/core/checkbox";
import { AiOutlineCheck } from "solid-icons/ai";
import { For, Show } from "solid-js";
import { useStorageState } from "./UseStorageState";
export function StorageList(props: {
  storageState: ReturnType<typeof useStorageState>;
}) {
  const storageState = () => props.storageState;
  return (
    <div>
      <Show
        when={(storageState().storageValues()?.length || 0) > 0}
        fallback={<div class="mp-6 text-center">暂无数据</div>}
      >
        <For each={storageState().storageValues()}>
          {(value) => (
            <div>
              <Checkbox
                class="checkbox w-full"
                checked={storageState().selected().includes(value)}
                onChange={() => storageState().toggle(value)}
              >
                <Checkbox.Input class="checkbox__input" />
                <Checkbox.Control class="checkbox__control flex-shrink-0">
                  <Checkbox.Indicator>
                    <AiOutlineCheck size={18} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label
                  class="checkbox__label flex-1 truncate"
                  title={value}
                >
                  {value}
                </Checkbox.Label>
              </Checkbox>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
