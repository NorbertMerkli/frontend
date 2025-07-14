import { describe, expect, test } from "vitest";

import { DerivedState, State } from "./state";

let value: number;

function listener(newValue: number): void {
  value = newValue;
}

describe("State", () => {
  const state = new State(0);

  test("get value", () => {
    expect(state.get()).toBe(0);
  });

  test("set value", () => {
    state.set(2);

    expect(state.get()).toBe(2);
  });

  test("subscribe", () => {
    state.addListener(listener);
    state.set(1);

    expect(value).toBe(1);
  });

  test("unsubscribe", () => {
    state.removeListener(listener);
    state.set(0);

    expect(value).toBe(1);
  });
});

describe("DerivedState", () => {
  const state = new State(1);
  const derivedState = new DerivedState((get) => get(state) * 2);

  test("get derived value", () => {
    expect(derivedState.get()).toBe(2);
  });

  test("stay passive while no listener", () => {
    state.set(2);

    expect(derivedState.get()).toBe(2);
  });

  test("attach on first listener", () => {
    derivedState.addListener(listener);
    state.set(4);

    expect(derivedState.get()).toBe(8);
    expect(value).toBe(8);
  });

  test("detach after last listener leaves", () => {
    derivedState.removeListener(listener);
    state.set(2);

    expect(derivedState.get()).toBe(8);
    expect(value).toBe(8);
  });
});
