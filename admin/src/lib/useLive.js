import { useEffect, useState } from "react";
import { subscribe } from "@shared/data.js";

/**
 * Subscribe a component to the shared data layer.
 * @template T
 * @param {() => T} getter
 * @param {{ pollMs?: number }} [opts]
 * @returns {T}
 */
export function useLive(getter, { pollMs } = {}) {
  const [value, setValue] = useState(getter);
  useEffect(() => {
    let alive = true;
    const refresh = () => {
      if (alive) setValue(getter());
    };
    refresh();
    const unsub = subscribe(refresh);
    const id = pollMs ? setInterval(refresh, pollMs) : null;
    return () => {
      alive = false;
      unsub();
      if (id) clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
