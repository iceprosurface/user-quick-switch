import { createMemo, createSignal } from "solid-js";

export function useStorageState() {
  const [storageValues, setStorageValues] = createSignal<string[]>();
  const [selected, setSelected] = createSignal<string[]>([]);

  function toggle(value: string) {
    if (selected().includes(value)) {
      setSelected(selected().filter((v) => v !== value));
    } else {
      setSelected([...selected(), value]);
    }
  }

  return {
    selected,
    toggle,
    storageValues,
    setStorageValues,
    label: createMemo(
      () => `(${selected().length}/${storageValues()?.length || 0})`,
    ),
  };
}
