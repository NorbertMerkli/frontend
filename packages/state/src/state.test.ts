import { afterEach, describe, expect, test } from "vitest";

import { DerivedState, LinkedState, State } from "./state";

describe("State", () => {
  const state = new State(0);

  let value: number | undefined;

  function listener(): void {
    value = state.get();
  }

  afterEach(() => {
    // Reset after each test
    state.set(0);
    value = undefined;
  });

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

    queueMicrotask(() => expect(value).toBe(1));
  });

  test("unsubscribe", () => {
    state.removeListener(listener);
    state.set(1);

    queueMicrotask(() => expect(value).toBe(undefined));
  });
});

describe("DerivedState", () => {
  const state = new State(1);
  const derivedState = new DerivedState((get) => get(state) * 2);

  let value: number | undefined;

  function listener(): void {
    value = derivedState.get();
  }

  afterEach(() => {
    // Reset after each test
    state.set(1);
    value = undefined;
  });

  test("get derived value", () => {
    expect(derivedState.get()).toBe(2);
  });

  test("stay passive while no listener", () => {
    state.set(2);

    expect(derivedState.get()).toBe(2);
  });

  test("attach on first listener", () => {
    derivedState.addListener(listener);
    state.set(2);

    queueMicrotask(() => {
      expect(derivedState.get()).toBe(4);
      expect(value).toBe(4);
    });
  });

  test("detach after last listener leaves", () => {
    derivedState.removeListener(listener);
    state.set(2);

    queueMicrotask(() => {
      expect(derivedState.get()).toBe(2);
      expect(value).toBe(undefined);
    });
  });
});

describe("LinkedState", () => {
  const state = new State(1);
  const linkedState = new LinkedState((get) => get(state) * 2);

  let value: number | undefined;

  function listener(): void {
    value = linkedState.get();
  }

  afterEach(() => {
    // Reset after each test
    state.set(1);
    value = undefined;
  });

  test("get linked value", () => {
    linkedState.addListener(listener);
    state.set(2);

    queueMicrotask(() => expect(value).toBe(4));
  });

  test("set value directly", () => {
    linkedState.set(1);

    queueMicrotask(() => expect(value).toBe(1));
  });

  test("reset value with linked", () => {
    state.set(2);

    queueMicrotask(() => expect(value).toBe(4));
  });
});

describe("Scheduling tasks", () => {
  const a = new State(1);
  const b = new State(1);
  const c = new DerivedState((get) => get(a) + get(b));

  let eventCount = 0;

  let value: number | undefined;

  function listener(): void {
    eventCount++;
    value = c.get();
  }

  afterEach(() => {
    // Reset after each test
    c.removeListener(listener);
    a.set(1);
    b.set(1);
    eventCount = 0;
    value = undefined;
  });

  test("Batch updates", () => {
    c.addListener(listener);

    a.set(2);
    b.set(2);

    queueMicrotask(() => {
      expect(eventCount).toBe(1);
      expect(value).toBe(4);
    });
  });
});
