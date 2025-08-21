import { useCallback, type ChangeEvent } from "react";
import {
  ComputedSignal,
  Signal,
  useSetSignal,
  useSignalValue,
} from "signal-react";

interface User {
  name: string;
  age: number;
  gender: "male" | "female";
}

type State = { [Key in keyof User]: User[Key] | null };

const user = new Signal<State>({
  name: null,
  age: null,
  gender: null,
});
const name = new ComputedSignal((get) => get(user).name ?? "");
const age = new ComputedSignal((get) => get(user).age ?? 0);
const gender = new ComputedSignal((get) => get(user).gender);

export const ObjectsWithSignal = () => {
  return (
    <form
      className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4 text-lg"
      onSubmit={(event) => event.preventDefault()}
    >
      <h5 className="text-slate-500 italic">with Signal</h5>
      <Name />
      <Age />
      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="col-span-full mb-2">Gender</legend>
        <Male />
        <Female />
      </fieldset>
    </form>
  );
};

const Name = () => {
  const value = useSignalValue(name);

  const setUser = useSetSignal(user);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({ ...user, name: event.target.value })),
    [setUser],
  );

  return (
    <>
      <label htmlFor="name">Name</label>
      <input
        className="rounded-md border-2 border-slate-300 p-2 hover:bg-white focus:bg-white"
        type="text"
        name="name"
        id="name"
        autoComplete="off"
        value={value}
        onChange={onChange}
      />
    </>
  );
};

const Age = () => {
  const value = useSignalValue(age);

  const setUser = useSetSignal(user);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({
        ...user,
        age: Number.parseInt(event.target.value),
      })),
    [setUser],
  );

  return (
    <>
      <label htmlFor="age">Age</label>
      <input
        className="rounded-md border-2 border-slate-300 p-2 hover:bg-white focus:bg-white"
        type="number"
        name="age"
        id="age"
        value={value}
        onChange={onChange}
      />
    </>
  );
};

const Male = () => {
  const checked = useSignalValue(gender) === "male";

  const setUser = useSetSignal(user);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      event.currentTarget.checked &&
      setUser((user) => ({
        ...user,
        gender: "male",
      })),
    [setUser],
  );

  return (
    <label
      className="flex items-center justify-between gap-4 rounded-md border-2 border-slate-300 p-2 px-4 hover:bg-white"
      htmlFor="signal-male"
    >
      Male
      <input
        type="radio"
        name="gender"
        id="signal-male"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};

const Female = () => {
  const checked = useSignalValue(gender) === "female";

  const setUser = useSetSignal(user);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      event.currentTarget.checked &&
      setUser((user) => ({
        ...user,
        gender: "female",
      })),
    [setUser],
  );

  return (
    <label
      className="flex items-center justify-between gap-4 rounded-md border-2 border-slate-300 p-2 px-4 hover:bg-white"
      htmlFor="signal-female"
    >
      Female
      <input
        type="radio"
        name="gender"
        id="signal-female"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
};
