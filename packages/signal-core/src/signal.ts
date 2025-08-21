import { INTERNAL_LISTENER_SYMBOL, type Listener } from "./eventEmitter";
import { Observable } from "./observable";

export interface ReadonlySignal<T> extends Observable<T> {
  readonly value: T;
}

export class Signal<T> extends Observable<T> implements ReadonlySignal<T> {
  constructor(initialValue: T, isEqual?: (a: T, b: T) => boolean) {
    super(initialValue, isEqual);
  }

  get value(): T {
    return this.getValue();
  }

  set value(newValue: T) {
    this.setValue(newValue);
  }
}

export class ComputedSignal<T>
  extends Observable<T>
  implements ReadonlySignal<T>
{
  private readonly _dependencies = new Set<ReadonlySignal<any>>();

  private readonly _listener: Listener;

  private _attach = () => {
    for (const signal of this._dependencies) {
      signal.addListener(this._listener);
    }
  };

  private _detach = () => {
    for (const signal of this._dependencies) {
      signal.removeListener(this._listener);
    }
  };

  constructor(init: (get: <U>(signal: ReadonlySignal<U>) => U) => T) {
    const dependencies = new Set<ReadonlySignal<any>>();

    const initialValue = init((signal) => {
      dependencies.add(signal);

      return signal.value;
    });

    super(initialValue);

    this._dependencies = dependencies;

    this._listener = () => this.setValue(init((signal) => signal.value));
    this._listener[INTERNAL_LISTENER_SYMBOL] = true;

    this._onStatusChange = (isActive) =>
      isActive ? this._attach() : this._detach();
  }

  get value(): T {
    return this.getValue();
  }
}
