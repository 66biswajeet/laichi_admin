import { useEffect, useRef, useCallback } from "react";

/**
 * Debounced autosave hook.
 * Calls `saveFn` after `delay` ms of no changes in `watchValue`.
 * Also exposes `saveNow()` for immediate save (e.g. on blur or Ctrl+S).
 *
 * @param {Function} saveFn    - async save function
 * @param {*}        watchValue - value to watch; change triggers the debounce timer
 * @param {number}   delay     - debounce delay in ms (default 10 000)
 * @param {boolean}  enabled   - if false the hook is dormant
 */
const useAutosave = (saveFn, watchValue, delay = 10000, enabled = true) => {
  const timerRef = useRef(null);
  const isSavingRef = useRef(false);
  const latestSaveFn = useRef(saveFn);

  // Keep the ref in sync so the timer closure always calls the latest version
  useEffect(() => {
    latestSaveFn.current = saveFn;
  }, [saveFn]);

  const triggerSave = useCallback(async () => {
    if (isSavingRef.current || !enabled) return;
    isSavingRef.current = true;
    try {
      await latestSaveFn.current();
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled]);

  // Reset the debounce timer whenever watchValue changes
  useEffect(() => {
    if (!enabled) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(triggerSave, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [watchValue, delay, enabled, triggerSave]);

  /** Force an immediate save and cancel any pending timer. */
  const saveNow = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    await triggerSave();
  }, [triggerSave]);

  return { saveNow };
};

export default useAutosave;
