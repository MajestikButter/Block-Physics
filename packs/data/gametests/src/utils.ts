import {
  Block,
  Dimension,
  Location,
  MinecraftDimensionTypes,
  Player,
  world,
} from "mojang-minecraft";
const overworld = world.getDimension(MinecraftDimensionTypes.overworld);

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

export function isInList(list: string[], str: string) {
  if (list.includes(str)) return true;
  return (
    list
      .filter((v) => v.startsWith("*"))
      .findIndex((v) => str.endsWith(v.slice(1))) >= 0
  );
}

export function getGamerules() {
  return JSON.parse(overworld.runCommand("gamerule").details);
}

export function sendMessage(plr: Player, msg: string) {
  plr.runCommand(`tellraw @s {"rawtext":[{"text":${JSON.stringify(msg)}}]}`);
}

export function createEntityBlock(
  block: string,
  dimension: Dimension,
  location: Location
) {
  const blockEnt = dimension.spawnEntity("bp:entity_block", location);
  blockEnt.triggerEvent("stackable");
  blockEnt.triggerEvent("physics");
  blockEnt.addTag(`$blockId:${block}`);

  let blockId = block;
  if (blockId.startsWith("minecraft:lit_"))
    blockId = blockId.replace("minecraft:lit_", "");
  else if (blockId.startsWith("minecraft:unlit_"))
    blockId = blockId.replace("minecraft:unlit_", "");

  setTimeout(() => {
    try {
      blockEnt.runCommand(
        `replaceitem entity @s slot.weapon.mainhand 0 ${blockId}`
      );
    } catch {}
  }, 1);
  return blockEnt;
}
