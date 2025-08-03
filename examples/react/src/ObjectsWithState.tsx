import {
  useCallback,
  useState,
  type ChangeEvent,
  type ChangeEventHandler,
} from "react";

interface User {
  name: string;
  age: number;
  gender: "male" | "female";
}

type State = { [Key in keyof User]: User[Key] | null };

export const ObjectsWithState = () => {
  const [user, setUser] = useState<State>(() => ({
    name: null,
    age: null,
    gender: null,
  }));

  const setName = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({ ...user, name: event.target.value })),
    [],
  );
  const setAge = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setUser((user) => ({
        ...user,
        age: Number.parseInt(event.target.value),
      })),
    [],
  );
  const setMale = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      event.currentTarget.checked &&
      setUser((user) => ({ ...user, gender: "male" })),
    [],
  );
  const setFemale = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      event.currentTarget.checked &&
      setUser((user) => ({ ...user, gender: "female" })),
    [],
  );

  return (
    <form
      className="flex flex-col gap-2 rounded-lg bg-slate-100 p-4 text-lg"
      onSubmit={(event) => event.preventDefault()}
    >
      <h5 className="text-slate-500 italic">with State</h5>
      <Name value={user.name ?? ""} onChange={setName} />
      <Age value={user.age ?? 0} onChange={setAge} />
      <fieldset className="grid grid-cols-2 gap-2">
        <legend className="col-span-full mb-2">Gender</legend>
        <Radio
          id="state-male"
          checked={user.gender === "male"}
          onChange={setMale}
        >
          Male
        </Radio>
        <Radio
          id="state-female"
          checked={user.gender === "female"}
          onChange={setFemale}
        >
          Female
        </Radio>
      </fieldset>
    </form>
  );
};

const Name = (props: {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <label htmlFor="name">Name</label>
      <input
        className="rounded-md border-2 border-slate-300 p-2 hover:bg-white focus:bg-white"
        type="text"
        name="name"
        id="name"
        autoComplete="off"
        {...props}
      />
    </>
  );
};

const Age = (props: {
  value: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <>
      <label htmlFor="age">Age</label>
      <input
        className="rounded-md border-2 border-slate-300 p-2 hover:bg-white focus:bg-white"
        type="number"
        name="age"
        id="age"
        {...props}
      />
    </>
  );
};

const Radio = ({
  children,
  ...props
}: {
  children: string;
  id: string;
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <label
      className="flex items-center justify-between gap-4 rounded-md border-2 border-slate-300 p-2 px-4 hover:bg-white"
      htmlFor={props.id}
    >
      {children}
      <input type="radio" name="gender" {...props} />
    </label>
  );
};
