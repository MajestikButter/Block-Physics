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
import {
  additionalVerticalVelocity,
  collideWithEntities,
  despawnTimer,
  dropWhenUnplaceable,
  enabled,
  horizontalVelocityModifier,
  placeWhenHitGround,
  rotateWithVelocity,
  simpleMath,
  verticalVelocityModifier,
} from "./explosion-config.js";
import { setTimeout } from "./utils.js";

const blockMap = new Map<Entity, BlockPermutation>();

function createEntityBlock(block: Block) {
  const dim = block.dimension;

  const blockEnt = dim.spawnEntity(
    "bp:entity_block",
    new Location(block.x + 0.5, block.y + 0.5, block.z + 0.5)
  );
  blockEnt.triggerEvent("stackable");
  if (collideWithEntities) blockEnt.triggerEvent("collision");
  if (despawnTimer) blockEnt.triggerEvent("despawn_timer");

  if (placeWhenHitGround) blockMap.set(blockEnt, block.permutation);
  blockEnt.addTag(`$blockId:${block.id}`);
  blockEnt.addTag("$entityBlockFromTNT");
  if (rotateWithVelocity) blockEnt.triggerEvent("rotate");

  let blockId = block.id;
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

if (enabled) {
  world.events.beforeExplosion.subscribe((evd) => {
    if (!evd.source) return;

    const dim = evd.dimension;
    const orgLoc = evd.source.location;
    const origin = new Vector(orgLoc.x, orgLoc.y + 0.5, orgLoc.z);

    const blocks = evd.impactedBlocks
      .map((v) => dim.getBlock(v))
      .filter((v) => v.id !== "minecraft:tnt");

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

      createEntityBlock(block).setVelocity(vel);
      block.setType(MinecraftBlockTypes.air);
    }
  });

  if (placeWhenHitGround) {
    const replaceableBlocks = [
      "minecraft:lava",
      "minecraft:water",
      "minecraft:air",
    ];
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
      if (replaceableBlocks.includes(block.id)) {
        block.setPermutation(perm);
        entity.triggerEvent("despawn");
      } else if (dropWhenUnplaceable) {
        const item = new ItemStack(Items.get(perm.type.id), 1);
        entity.dimension.spawnItem(item, loc);
        entity.triggerEvent("despawn");
      }
    }, options);
  }
}
