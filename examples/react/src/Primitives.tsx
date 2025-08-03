import { PrimitivesWithState } from "./PrimitivesWithState";
import { PrimitivesWithSignal } from "./PrimitivesWithSignal";

export const Primitives = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_1fr] gap-4 rounded-xl bg-white p-4 shadow-md">
      <h3 className="text-xl font-bold text-slate-500 uppercase">Primitives</h3>
      <PrimitivesWithState />
      <PrimitivesWithSignal />
    </div>
  );
};
