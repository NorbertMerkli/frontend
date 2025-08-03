import { useCallback, useMemo, useState } from "react";
import {
  DerivedSignal,
  Signal,
  useSetSignal,
  useSignalValue,
  type ReadonlySignal,
} from "signal-react";
import { cn, type PropsWithClassName } from "./utils/style";

export const Primitives = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_1fr] gap-4 rounded-xl bg-white p-4 shadow-md">
      <h3 className="text-xl font-bold text-slate-500 uppercase">Primitives</h3>
      <WithState />
      <WithSignal />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 WITH STATE                                 */
/* -------------------------------------------------------------------------- */

const WithState = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  const c = useMemo(() => a + b, [a, b]);

  const decrementA = useCallback(() => setA((state) => --state), []);
  const incrementA = useCallback(() => setA((state) => ++state), []);

  const decrementB = useCallback(() => setB((state) => --state), []);
  const incrementB = useCallback(() => setB((state) => ++state), []);

  return (
    <div className="grid grid-cols-5 grid-rows-3 gap-4 rounded-lg bg-slate-100 p-4 pt-2 text-lg">
      <h5 className="col-span-full text-slate-500 italic">with State</h5>
      <span className="text-center text-3xl font-bold">{a}</span>
      <div className="col-start-1 row-start-3 grid grid-cols-2 place-items-center gap-4">
        <button
          className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
          onClick={decrementA}
        >
          -
        </button>
        <button
          className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
          onClick={incrementA}
        >
          +
        </button>
      </div>
      <span className="text-center text-3xl text-slate-500">+</span>
      <span className="text-center text-3xl font-bold">{b}</span>
      <div className="col-start-3 row-start-3 grid grid-cols-2 place-items-center gap-4">
        <button
          className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
          onClick={decrementB}
        >
          -
        </button>
        <button
          className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
          onClick={incrementB}
        >
          +
        </button>
      </div>
      <span className="text-center text-3xl text-slate-500">=</span>
      <span className="text-center text-3xl font-bold">{c}</span>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 WITH SIGNAL                                */
/* -------------------------------------------------------------------------- */

const a = new Signal(1);
const b = new Signal(1);
const c = new DerivedSignal((get) => get(a) + get(b));

const WithSignal = () => {
  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-4 rounded-lg bg-slate-100 p-4 pt-2 text-lg">
      <h5 className="col-span-full text-slate-500 italic">with Signal</h5>
      <Value signal={a} />
      <Controller className="col-start-1 row-start-3" signal={a} />
      <span className="text-center text-3xl text-slate-500">+</span>
      <Value signal={b} />
      <Controller className="col-start-3 row-start-3" signal={b} />
      <span className="text-center text-3xl text-slate-500">=</span>
      <Value signal={c} />
    </div>
  );
};

const Value = (props: { signal: ReadonlySignal<number> }) => {
  const state = useSignalValue(props.signal);

  return <span className="text-center text-3xl font-bold">{state}</span>;
};

const Controller = (props: PropsWithClassName & { signal: Signal<number> }) => {
  const setState = useSetSignal(props.signal);

  const decrement = useCallback(() => setState((state) => --state), [setState]);
  const increment = useCallback(() => setState((state) => ++state), [setState]);

  return (
    <div
      className={cn(
        "grid grid-cols-2 place-items-center gap-4",
        props.className,
      )}
    >
      <button
        className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
        onClick={decrement}
      >
        -
      </button>
      <button
        className="size-10 cursor-pointer rounded-full border-2 border-slate-300 text-slate-500 hover:bg-white"
        onClick={increment}
      >
        +
      </button>
    </div>
  );
};
