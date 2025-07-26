import {
  DerivedSignal,
  Signal,
  useSignal,
  useSignalValue,
  type ReadonlySignal,
} from "signal-react";

const a = new Signal(0);
const b = new Signal(0);
const c = new DerivedSignal((get) => get(a) + get(b));

export const App = () => {
  return (
    <>
      <Controller signal={a} />
      <Controller signal={b} />
      <Value signal={c} />
    </>
  );
};

const Controller = (props: { signal: Signal<number> }) => {
  const [state, setState] = useSignal(props.signal);

  return (
    <span>
      <span>{state}</span>
      <button onClick={() => setState((state) => --state)}>-</button>
      <button onClick={() => setState((state) => ++state)}>+</button>
    </span>
  );
};

const Value = (props: { signal: ReadonlySignal<number> }) => {
  const state = useSignalValue(props.signal);

  return <span>{state}</span>;
};
