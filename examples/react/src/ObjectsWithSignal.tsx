import { useCallback, type ChangeEvent } from "react";

import { Signal, useSignal } from "signal-react";

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
  const [name, setUser] = useSignal(user, (user) => user.name);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({ ...user, name: event.target.value || null })),
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
        value={name ?? ""}
        onChange={onChange}
      />
    </>
  );
};

const Age = () => {
  const [age, setUser] = useSignal(user, (user) => user.age);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({
        ...user,
        age: event.target.value ? Number.parseInt(event.target.value) : null,
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
        value={age ?? 0}
        onChange={onChange}
      />
    </>
  );
};

const Male = () => {
  const [isMale, setUser] = useSignal(user, (user) => user.gender === "male");

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
        checked={isMale}
        onChange={onChange}
      />
    </label>
  );
};

const Female = () => {
  const [isFemale, setUser] = useSignal(
    user,
    (user) => user.gender === "female",
  );

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
        checked={isFemale}
        onChange={onChange}
      />
    </label>
  );
};
