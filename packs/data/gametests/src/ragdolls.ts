import {
  Entity,
  EntityHealthComponent,
  EntityTypes,
  Location,
  Vector,
  world,
} from "mojang-minecraft";

function spawnRagdoll(entity: Entity) {
  const idSplit = entity.id.split(":");
  const namespace = idSplit[0] == "minecraft" ? "bp" : idSplit[0];
  const ragdollId = idSplit[1];

  const entityType = EntityTypes.get(`${namespace}:ragdoll_${ragdollId}`);
  if (!entityType) return;

  const loc = entity.location;
  const ragdoll = entity.dimension.spawnEntity(entityType.id, loc);

  const vel = Vector.multiply(entity.velocity, new Vector(3, 2, 3));
  ragdoll.setVelocity(vel);
  entity.teleport(new Location(loc.x, -100, loc.z), entity.dimension, 0, 0);

  return ragdoll;
}

world.events.entityHurt.subscribe((evd) => {
  const ent = evd.hurtEntity;
  console.log(ent.id);
  if (ent.id == "minecraft:player" || ent.hasTag("$ragdolled")) return;

  const hp = ent.getComponent("health") as EntityHealthComponent;
  console.log(hp.current, ent.id);
  if (hp.current > 0) return;

  spawnRagdoll(ent);
  ent.addTag("$ragdolled");
});

world.events.tick.subscribe((evd) => {
  for (let plr of world.getPlayers()) {
    const hp = plr.getComponent("health") as EntityHealthComponent;

    if (hp.current > 0) {
      if (plr.hasTag("$ragdolled")) plr.removeTag("$ragdolled");
    } else if (!plr.hasTag("$ragdolled")) {
      spawnRagdoll(plr);
      plr.addTag("$ragdolled");
    }
  }
});
