import { world } from "mojang-minecraft";

let lastTimeoutId = 0;
const timeouts: (
  | { id: number; callback: () => void; ticks: number }
  | undefined
)[] = [];

export function setTimeout(callback: () => void, ticks: number) {
  lastTimeoutId++;
  const ind = timeouts.findIndex((v) => !v);
  const entry: typeof timeouts[number] = { id: lastTimeoutId, callback, ticks };

  if (ind < 0) {
    timeouts.push(entry);
  } else timeouts[ind] = entry;

  return lastTimeoutId;
}
export function clearTimeout(id: number) {
  const ind = timeouts.findIndex((v) => v?.id == id);
  if (ind < 0) throw new Error("No timeout with this id");
  timeouts[ind] = undefined;
}

world.events.tick.subscribe((evd) => {
  for (let i = 0; i < timeouts.length; i++) {
    const timeout = timeouts[i];

    if (!timeout) continue;

    if (timeout.ticks <= 0) {
      timeout.callback();
      timeout[i] = undefined;
      continue;
    }
    timeout.ticks--;
  }
});

export function wait(ticks: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ticks);
  });
}
