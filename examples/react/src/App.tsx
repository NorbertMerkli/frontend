import type { CSSProperties } from "react";
import {
  DerivedSignal,
  Signal,
  useSetSignal,
  useSignalValue,
  type ReadonlySignal,
} from "signal-react";

const a = new Signal(0);
const b = new Signal(0);
const c = new DerivedSignal((get) => get(a) + get(b));

export const App = () => {
  return (
    <div
      style={{
        fontSize: "2rem",
        fontWeight: "bold",
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr auto 1fr",
        gridTemplateRows: "1fr 1fr",
        justifyItems: "center",
        gap: "1rem",
      }}
    >
      <Value signal={a} />
      <span>+</span>
      <Value signal={b} />
      <span>=</span>
      <Value signal={c} />
      <Controller signal={a} />
      <Controller signal={b} style={{ gridColumnStart: 3 }} />
    </div>
  );
};

const Controller = (props: {
  signal: Signal<number>;
  style?: CSSProperties;
}) => {
  const setState = useSetSignal(props.signal);

  return (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        ...props.style,
      }}
    >
      <button
        style={{ paddingInline: "1rem" }}
        onClick={() => setState((state) => --state)}
      >
        -
      </button>
      <button
        style={{ paddingInline: "1rem" }}
        onClick={() => setState((state) => ++state)}
      >
        +
      </button>
    </div>
  );
};

const Value = (props: { signal: ReadonlySignal<number> }) => {
  const state = useSignalValue(props.signal);

  return <span>{state}</span>;
};
