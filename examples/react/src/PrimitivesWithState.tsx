import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { cn, type PropsWithClassName } from "./utils/style";

export const PrimitivesWithState = () => {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);

  const c = useMemo(() => a + b, [a, b]);

  return (
    <div className="grid grid-cols-5 grid-rows-2 gap-4 rounded-lg bg-slate-100 p-4 pt-2 text-lg">
      <h5 className="col-span-full text-slate-500 italic">with State</h5>
      <Value state={a} />
      <Controller className="col-start-1 row-start-3" setState={setA} />
      <span className="text-center text-3xl text-slate-500">+</span>
      <Value state={b} />
      <Controller className="col-start-3 row-start-3" setState={setB} />
      <span className="text-center text-3xl text-slate-500">=</span>
      <Value state={c} />
    </div>
  );
};

const Value = (props: { state: number }) => (
  <span className="text-center text-3xl font-bold">{props.state}</span>
);

const Controller = (
  props: PropsWithClassName & { setState: Dispatch<SetStateAction<number>> },
) => {
  const decrement = useCallback(
    () => props.setState((state) => --state),
    [props],
  );
  const increment = useCallback(
    () => props.setState((state) => ++state),
    [props],
  );

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
