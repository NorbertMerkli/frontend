export const INTERNAL_LISTENER_SYMBOL = Symbol("INTERNAL_LISTENER");

export type Listener = (() => void) & { [INTERNAL_LISTENER_SYMBOL]?: true };

const externalListeners = new Set<() => void>();

let isScheduled = false;

function notifyListeners(): void {
  for (const notify of externalListeners) notify();

  externalListeners.clear();

  isScheduled = false;
}

function scheduleUpdate(): void {
  if (queueMicrotask === undefined) {
    Promise.resolve().then(notifyListeners);
  } else {
    queueMicrotask(notifyListeners);
  }

  isScheduled = true;
}

export class EventEmitter {
  private readonly _listeners = new Set<Listener>();

  protected emit = () => {
    if (this._listeners.size > 0) {
      if (!isScheduled) scheduleUpdate();

      for (const listener of this._listeners) {
        if (INTERNAL_LISTENER_SYMBOL in listener) {
          listener();
        } else {
          externalListeners.add(listener);
        }
      }
    }
  };

  protected _onStatusChange: ((isActive: boolean) => void) | undefined;

  addListener = (listener: Listener) => {
    this._listeners.add(listener);

    if (this._listeners.size === 1) this._onStatusChange?.(true);
  };

  removeListener = (listener: Listener) => {
    this._listeners.delete(listener);

    if (this._listeners.size === 0) this._onStatusChange?.(false);
  };
}
