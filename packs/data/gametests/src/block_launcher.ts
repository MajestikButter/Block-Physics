import { Block, Player, Vector, world } from "mojang-minecraft";
import { explosionConfig } from "./explosion-config.js";
import { createEntityBlock, isInList, sendMessage } from "./utils";

let {
  collideWithEntities,
  ignoreBlocks,
  rotateWithVelocity,
} = explosionConfig;
ignoreBlocks = ignoreBlocks.map((v) => v.replace("minecraft:", ""));

const blocks = new Map<Player, Block>();
world.events.itemUseOn.subscribe((evd) => {
  if (evd.item.id != "minecraft:stick" || evd.item.nameTag !== "Block Launcher")
    return;
  const plr = evd.source;
  if (!(plr instanceof Player)) return;
  const currBlock = blocks.get(plr);
  const block = evd.source.dimension.getBlock(evd.blockLocation);
  if (currBlock?.id == block.id) return;
  if (isInList(ignoreBlocks, block.id.replace("minecraft:", ""))) {
    return sendMessage(
      plr,
      `[Block Launcher] Block cannot be set to ${block.id}, this block is in the ignore list`
    );
  }
  blocks.set(plr, block);
  sendMessage(plr, `[Block Launcher] Block set to ${block.id}`);
});

world.events.itemUse.subscribe((evd) => {
  if (evd.item.id != "minecraft:stick" || evd.item.nameTag !== "Block Launcher")
    return;

  const plr = evd.source;
  if (!(plr instanceof Player)) return;
  const block = blocks.get(plr);
  if (!block) {
    return sendMessage(
      plr,
      "[Block Launcher] No block picked, pick a block to fire by clicking one"
    );
  }
  const eBlock = createEntityBlock(block.id, block.dimension, plr.headLocation);
  if (collideWithEntities) eBlock.triggerEvent("collision");
  eBlock.triggerEvent("despawn_timer");
  if (rotateWithVelocity) eBlock.triggerEvent("rotate");
  eBlock.setVelocity(Vector.multiply(plr.viewVector, 2));
});