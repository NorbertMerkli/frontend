import $ from "jquery";

import { ComputedSignal, Signal } from "signal-core";

export function init(): void {
  const count = new Signal(0);
  const type = new ComputedSignal((get) => (get(count) % 2 ? "odd" : "even"));

  const onCountChange = () => $("#value").text(count.value);
  const onTypeChange = () => $("#type").text(type.value);

  count.addListener(onCountChange);
  type.addListener(onTypeChange);

  onCountChange();
  onTypeChange();

  $("#decrement").on("click", () => count.value--);
  $("#increment").on("click", () => count.value++);
}
