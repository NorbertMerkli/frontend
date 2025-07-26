import {
  useCallback,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Signal, type ReadonlySignal } from "signal-core";

export function useSignalValue<T>(signal: ReadonlySignal<T>): T {
  return useSyncExternalStore(
    useCallback(
      (listener) => {
        signal.addListener(listener);

        return () => {
          signal.removeListener(listener);
        };
      },
      [signal]
    ),
    signal.get
  );
}

export function useSetSignal<T>(
  signal: Signal<T>
): Dispatch<SetStateAction<T>> {
  return useCallback(
    (setStateAction: SetStateAction<T>) => {
      if (typeof setStateAction === "function") {
        signal.set((setStateAction as (state: T) => T)(signal.get()));
      } else {
        signal.set(setStateAction);
      }
    },
    [signal]
  );
}

export function useSignal<T>(
  signal: Signal<T>
): [T, Dispatch<SetStateAction<T>>] {
  return [useSignalValue(signal), useSetSignal(signal)];
}
