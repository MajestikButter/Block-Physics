import {
  Block,
  BlockLocation,
  BlockPermutation,
  Entity,
  EntityDataDrivenTriggerEventOptions,
  Items,
  ItemStack,
  Location,
  MinecraftBlockTypes,
  Vector,
  world,
} from "mojang-minecraft";
import { createEntityBlock, getGamerules, isInList } from "./utils.js";

import { explosionConfig } from "./explosion-config.js";
let {
  additionalVerticalVelocity,
  collideWithEntities,
  despawnTimer,
  dropWhenUnplaceable,
  enabled,
  horizontalVelocityModifier,
  ignoreBlocks,
  placeWhenHitGround,
  replaceBlocks,
  rotateWithVelocity,
  simpleMath,
  verticalVelocityModifier,
  minBlocksToSpawnPerTick,
} = explosionConfig;
ignoreBlocks = ignoreBlocks.map((v) => v.replace("minecraft:", ""));
replaceBlocks = replaceBlocks.map((v) => v.replace("minecraft:", ""));

const blockMap = new Map<Entity, BlockPermutation>();

let tick = 0;
world.events.tick.subscribe(({ currentTick }) => (tick = currentTick));
if (enabled) {
  world.events.beforeExplosion.subscribe(async (evd) => {
    if (!evd.source) return;

    const dim = evd.dimension;
    const orgLoc = evd.source.location;
    const origin = new Vector(orgLoc.x, orgLoc.y + 0.5, orgLoc.z);

    const blocks = evd.impactedBlocks
      .map((v) => dim.getBlock(v))
      .filter((v) => !isInList(ignoreBlocks, v.id.replace("minecraft:", "")));

    const blockDist = new Map<Block, number>();
    const blockId = new Map<Block, string>();
    for (let block of blocks) {
      if (!simpleMath) {
        blockDist.set(
          block,
          Math.hypot(
            origin.x - block.x,
            origin.y - (block.y - 0.5),
            origin.z - block.z
          )
        );
      }
      blockId.set(block, block.id);
    }
    const range = Math.max(...blockDist.values());

    let currentTick = tick;
    let blocksInTick = 0;

    for (let block of blocks) {
      const pos = new Vector(block.x + 0.5, block.y - 0.5, block.z + 0.5);

      let vel = Vector.subtract(pos, origin);
      const dist = Math.hypot(vel.x, vel.y, vel.z);
      vel = Vector.divide(vel, dist);

      if (!simpleMath) {
        const distMod =
          (range - Math.pow(dist, 1.5) + Math.pow(dist, 1.1)) / range;
        vel = Vector.multiply(vel, distMod * 2);
      }

      vel.y += additionalVerticalVelocity;
      vel = Vector.multiply(
        vel,
        new Vector(
          horizontalVelocityModifier,
          verticalVelocityModifier,
          horizontalVelocityModifier
        )
      );

      const id = blockId.get(block) ?? "minecraft:air";
      const eBlock = createEntityBlock(
        id,
        block.dimension,
        new Location(block.x + 0.5, block.y + 0.5, block.z + 0.5)
      );

      eBlock.addTag("$entityBlockFromTNT");
      if (collideWithEntities) eBlock.triggerEvent("collision");
      if (despawnTimer) eBlock.triggerEvent("despawn_timer");
      if (placeWhenHitGround) blockMap.set(eBlock, block.permutation);
      if (rotateWithVelocity) eBlock.triggerEvent("rotate");
      eBlock.setVelocity(vel);
      block.setType(MinecraftBlockTypes.air);
      if (currentTick != tick) {
        currentTick = tick;
        blocksInTick = 0;
      }
      blocksInTick++;
      if (blocksInTick > minBlocksToSpawnPerTick) await null;
    }
  });

  if (placeWhenHitGround) {
    const options = new EntityDataDrivenTriggerEventOptions();
    options.eventTypes = ["hit_ground"];
    world.events.beforeDataDrivenEntityTriggerEvent.subscribe((evd) => {
      const entity = evd.entity;
      if (!entity.hasTag("$entityBlockFromTNT")) return;

      const perm = blockMap.get(entity);
      blockMap.delete(entity);
      if (!perm) return;

      const loc = entity.location;
      const block = entity.dimension.getBlock(
        new BlockLocation(
          Math.floor(loc.x),
          Math.floor(loc.y + 0.25),
          Math.floor(loc.z)
        )
      );
      if (isInList(replaceBlocks, block.id.replace("minecraft:", ""))) {
        block.setPermutation(perm);
      } else if (dropWhenUnplaceable) {
        if (getGamerules().dotiledrops) {
          const item = new ItemStack(Items.get(perm.type.id), 1);
          entity.dimension.spawnItem(item, loc);
        }
      }
      entity.triggerEvent("despawn");
    }, options);
  }
}
