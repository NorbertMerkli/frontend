const SYMBOL_INTERNAL = Symbol("INTERNAL");

type Listener = Function & { [SYMBOL_INTERNAL]?: boolean };

const scheduledCallbacks = new Set<Listener>();

let isScheduled = false;

class EventEmitter {
  private readonly listeners = new Set<Listener>();

  protected emit = () => {
    if (!isScheduled) {
      isScheduled = true;

      queueMicrotask(() => {
        for (const callback of scheduledCallbacks) callback();

        isScheduled = false;
      });
    }

    for (const listener of this.listeners) {
      if (listener[SYMBOL_INTERNAL]) {
        listener();
      } else {
        scheduledCallbacks.add(listener);
      }
    }
  };

  protected onStatusChange: ((isActive: boolean) => void) | undefined;

  addListener = (listener: Listener) => {
    this.listeners.add(listener);

    if (this.listeners.size === 1) this.onStatusChange?.(true);
  };

  removeListener = (listener: Listener) => {
    this.listeners.delete(listener);

    if (this.listeners.size === 0) this.onStatusChange?.(false);
  };
}

class Observable<T> extends EventEmitter {
  private value: T;

  protected getValue = () => this.value;

  protected setValue = (value: T) => {
    if (!Object.is(value, this.value)) {
      this.value = value;

      this.emit();
    }
  };

  constructor(initialValue: T) {
    super();

    this.value = initialValue;
  }
}

class _ReadonlySignal<T> extends Observable<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  get = this.getValue;
}

export type ReadonlySignal<T> = _ReadonlySignal<T>;

export class Signal<T> extends _ReadonlySignal<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }

  set = this.setValue;
}

export class DerivedSignal<T> extends _ReadonlySignal<T> {
  private dependencies: Set<_ReadonlySignal<T>>;

  private reset: Listener;

  private attach = () => {
    for (const state of this.dependencies) state.addListener(this.reset);

    this.reset();
  };

  private detach = () => {
    for (const state of this.dependencies) state.removeListener(this.reset);
  };

  constructor(derive: (get: <U>(state: _ReadonlySignal<U>) => U) => T) {
    const dependencies = new Set<_ReadonlySignal<any>>();

    super(
      derive((state) => {
        dependencies.add(state);

        return state.get();
      })
    );

    this.dependencies = dependencies;

    this.reset = () => this.setValue(derive((state) => state.get()));

    this.reset[SYMBOL_INTERNAL] = true;

    this.onStatusChange = (isActive) =>
      isActive ? this.attach() : this.detach();
  }
}

export class LinkedSignal<T> extends DerivedSignal<T> {
  constructor(derive: (get: <U>(state: _ReadonlySignal<U>) => U) => T) {
    super(derive);
  }

  set = this.setValue;
}
