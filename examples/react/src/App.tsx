import { ObjectsWithSignal } from "./ObjectsWithSignal";
import { ObjectsWithState } from "./ObjectsWithState";
import { PrimitivesWithSignal } from "./PrimitivesWithSignal";
import { PrimitivesWithState } from "./PrimitivesWithState";

export const App = () => {
  return (
    <div className="grid h-screen grid-rows-2 gap-4 overflow-hidden bg-slate-100 p-4">
      <div className="grid grid-rows-[auto_1fr_1fr] gap-4 rounded-xl bg-white p-4 shadow-md">
        <h3 className="text-xl font-bold text-slate-500 uppercase">
          Primitives
        </h3>
        <PrimitivesWithState />
        <PrimitivesWithSignal />
      </div>
      <div className="grid grid-cols-2 grid-rows-[auto_1fr] gap-4 rounded-xl bg-white p-4 shadow-md">
        <h3 className="col-span-2 text-xl font-bold text-slate-500 uppercase">
          Objects
        </h3>
        <ObjectsWithState />
        <ObjectsWithSignal />
      </div>
    </div>
  );
};
