import { describe, expect, test } from "vitest";

import { ComputedSignal, Signal } from "./signal";

describe("Signal", () => {
  test("initialize", () => {
    const signal = new Signal(0);

    expect(signal.value).toBe(0);
  });

  test("notify listeners", () => {
    const signal = new Signal(0);

    expect(signal.value).toBe(0);

    let value = signal.value;

    signal.addListener(() => (value = signal.value));

    signal.value++;

    expect(signal.value).toBe(1);

    queueMicrotask(() => expect(value).toBe(1));
  });

  test("batch updates", () => {
    const signal = new Signal(0);

    expect(signal.value).toBe(0);

    let value = signal.value;

    signal.addListener(() => (value = signal.value));

    signal.value++;

    expect(signal.value).toBe(1);

    queueMicrotask(() => expect(value).toBe(2));

    signal.value++;

    expect(signal.value).toBe(2);

    queueMicrotask(() => expect(value).toBe(2));
  });
});

describe("ComputedSignal", () => {
  test("initialize", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(1);
    const computedSignal = new ComputedSignal(
      (get) => get(signalA) + get(signalB)
    );

    expect(computedSignal.value).toBe(2);
  });

  test("stay passive while no listener", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(1);
    const computedSignal = new ComputedSignal(
      (get) => get(signalA) + get(signalB)
    );

    expect(computedSignal.value).toBe(2);

    signalA.value++;

    expect(computedSignal.value).toBe(2);

    let value = computedSignal.value;

    computedSignal.addListener(() => (value = computedSignal.value));

    signalB.value++;

    expect(computedSignal.value).toBe(4);

    queueMicrotask(() => expect(value).toBe(4));
  });

  test("notify listeners", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(1);
    const computedSignal = new ComputedSignal(
      (get) => get(signalA) + get(signalB)
    );

    expect(computedSignal.value).toBe(2);

    let value = computedSignal.value;

    computedSignal.addListener(() => (value = computedSignal.value));

    signalA.value++;

    expect(computedSignal.value).toBe(3);

    queueMicrotask(() => expect(value).toBe(3));
  });

  test("batch updates", () => {
    const signalA = new Signal(1);
    const signalB = new Signal(1);
    const computedSignal = new ComputedSignal(
      (get) => get(signalA) + get(signalB)
    );

    expect(computedSignal.value).toBe(2);

    let value = computedSignal.value;

    computedSignal.addListener(() => (value = computedSignal.value));

    signalA.value++;

    expect(computedSignal.value).toBe(3);

    queueMicrotask(() => expect(value).toBe(4));

    signalB.value++;

    expect(computedSignal.value).toBe(4);

    queueMicrotask(() => expect(value).toBe(4));
  });
});
