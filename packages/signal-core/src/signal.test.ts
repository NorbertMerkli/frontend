import { afterEach, describe, expect, test } from "vitest";

import { DerivedSignal, LinkedSignal, Signal } from "./signal";

describe("Signal", () => {
  const signal = new Signal(0);

  let value: number | undefined;

  function listener(): void {
    value = signal.get();
  }

  afterEach(() => {
    // Reset after each test
    signal.set(0);
    value = undefined;
  });

  test("get value", () => {
    expect(signal.get()).toBe(0);
  });

  test("set value", () => {
    signal.set(2);

    expect(signal.get()).toBe(2);
  });

  test("subscribe", () => {
    signal.addListener(listener);
    signal.set(1);

    queueMicrotask(() => expect(value).toBe(1));
  });

  test("unsubscribe", () => {
    signal.removeListener(listener);
    signal.set(1);

    queueMicrotask(() => expect(value).toBe(undefined));
  });
});

describe("DerivedSignal", () => {
  const signal = new Signal(1);
  const derivedSignal = new DerivedSignal((get) => get(signal) * 2);

  let value: number | undefined;

  function listener(): void {
    value = derivedSignal.get();
  }

  afterEach(() => {
    // Reset after each test
    signal.set(1);
    value = undefined;
  });

  test("get derived value", () => {
    expect(derivedSignal.get()).toBe(2);
  });

  test("stay passive while no listener", () => {
    signal.set(2);

    expect(derivedSignal.get()).toBe(2);
  });

  test("attach on first listener", () => {
    derivedSignal.addListener(listener);
    signal.set(2);

    queueMicrotask(() => {
      expect(derivedSignal.get()).toBe(4);
      expect(value).toBe(4);
    });
  });

  test("detach after last listener leaves", () => {
    derivedSignal.removeListener(listener);
    signal.set(2);

    queueMicrotask(() => {
      expect(derivedSignal.get()).toBe(2);
      expect(value).toBe(undefined);
    });
  });
});

describe("LinkedSignal", () => {
  const signal = new Signal(1);
  const linkedSignal = new LinkedSignal((get) => get(signal) * 2);

  let value: number | undefined;

  function listener(): void {
    value = linkedSignal.get();
  }

  afterEach(() => {
    // Reset after each test
    signal.set(1);
    value = undefined;
  });

  test("get linked value", () => {
    linkedSignal.addListener(listener);
    signal.set(2);

    queueMicrotask(() => expect(value).toBe(4));
  });

  test("set value directly", () => {
    linkedSignal.set(1);

    queueMicrotask(() => expect(value).toBe(1));
  });

  test("reset value with linked", () => {
    signal.set(2);

    queueMicrotask(() => expect(value).toBe(4));
  });
});

describe("Scheduling tasks", () => {
  const a = new Signal(1);
  const b = new Signal(1);
  const c = new DerivedSignal((get) => get(a) + get(b));

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
