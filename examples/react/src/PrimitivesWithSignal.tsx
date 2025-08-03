import { useCallback } from "react";
import {
  DerivedSignal,
  Signal,
  useSetSignal,
  useSignalValue,
  type ReadonlySignal,
} from "signal-react";
import { cn, type PropsWithClassName } from "./utils/style";

const a = new Signal(1);
const b = new Signal(1);
const c = new DerivedSignal((get) => get(a) + get(b));

export const PrimitivesWithSignal = () => {
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
