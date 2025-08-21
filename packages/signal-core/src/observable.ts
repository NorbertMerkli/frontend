import { EventEmitter } from "./eventEmitter";

export class Observable<T> extends EventEmitter {
  private _value: T;

  private _isEqual: (a: T, b: T) => boolean;

  protected getValue = () => this._value;

  protected setValue = (newValue: T) => {
    if (!this._isEqual(this._value, newValue)) {
      this._value = newValue;

      this.emit();
    }
  };

  constructor(initialValue: T, isEqual?: (a: T, b: T) => boolean) {
    super();

    this._value = initialValue;

    this._isEqual = isEqual ?? Object.is;
  }
}
