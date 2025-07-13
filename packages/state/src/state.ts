export interface Observable<T> {
  addListener: (listener: (value: T) => void) => void;
  removeListener: (listener: (value: T) => void) => void;
  getListenerCount: () => number;
}

export interface ReadonlyState<T> extends Observable<T> {
  get: () => T;
}

export interface State<T> extends ReadonlyState<T> {
  set: (value: T) => void;
}

export function createState<T>(initialValue: T): State<T> {
  const listeners = new Set<(value: T) => void>();

  let value = initialValue;

  const state = Object.create(null);

  state.addListener = (listener: (value: T) => void) => {
    listeners.add(listener);
  };

  state.removeListener = (listener: (value: T) => void) => {
    listeners.delete(listener);
  };

  state.getListenerCount = () => listeners.size;

  state.get = () => value;

  state.set = (newValue: T) => {
    if (!Object.is(newValue, value)) {
      value = newValue;

      for (const listener of listeners) listener(value);
    }
  };

  return state;
}

export function createDerivedState<T>(
  derive: (get: <U>(state: ReadonlyState<U>) => U) => T
): ReadonlyState<T> {
  const dependencies = new Set<ReadonlyState<any>>();

  const state = createState(
    derive((state) => {
      dependencies.add(state);

      return state.get();
    })
  );

  const derivedState = Object.create(null);

  derivedState.get = state.get;
  derivedState.getListenerCount = state.getListenerCount;

  derivedState.reset = () => state.set(derive((state) => state.get()));

  derivedState.attach = () => {
    for (const dependency of dependencies) {
      dependency.addListener(derivedState.reset);
    }

    derivedState.reset();
  };

  derivedState.detach = () => {
    for (const dependency of dependencies) {
      dependency.removeListener(derivedState.reset);
    }
  };

  derivedState.addListener = (listener: (value: T) => void) => {
    state.addListener(listener);

    if (state.getListenerCount() === 1) derivedState.attach();
  };

  derivedState.removeListener = (listener: (value: T) => void) => {
    state.removeListener(listener);

    if (state.getListenerCount() === 0) derivedState.detach();
  };

  return derivedState;
}
