import {
  useCallback,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
  type Dispatch,
  type SetStateAction,
} from "react";

import { Signal, type ReadonlySignal } from "signal-core";

export function useSignalValue<T>(signal: ReadonlySignal<T>): T;
export function useSignalValue<T, U>(
  signal: ReadonlySignal<T>,
  selector: ((signalValue: T) => U) | undefined
): U;
export function useSignalValue<T, U>(
  signal: ReadonlySignal<T>,
  selector?: ((signalValue: T) => U) | undefined
): T | U {
  const selectorRef = useRef(selector);

  useLayoutEffect(() => {
    selectorRef.current = selector;
  }, [selector]);

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
    useCallback(
      () =>
        selectorRef.current ? selectorRef.current(signal.value) : signal.value,
      [signal]
    )
  );
}

export function useSetSignal<T>(
  signal: Signal<T>
): Dispatch<SetStateAction<T>> {
  return useCallback(
    (setStateAction: SetStateAction<T>) => {
      if (typeof setStateAction === "function") {
        signal.value = (setStateAction as (state: T) => T)(signal.value);
      } else {
        signal.value = setStateAction;
      }
    },
    [signal]
  );
}

export function useSignal<T>(
  signal: Signal<T>
): [T, Dispatch<SetStateAction<T>>];
export function useSignal<T, U>(
  signal: Signal<T>,
  selector: ((signalValue: T) => U) | undefined
): [U, Dispatch<SetStateAction<T>>];
export function useSignal<T, U>(
  signal: Signal<T>,
  selector?: ((signalValue: T) => U) | undefined
): [T | U, Dispatch<SetStateAction<T>>] {
  return [useSignalValue(signal, selector), useSetSignal(signal)];
}
