export const explosionConfig: {
  /**
   * Enables or disables block explosion physics.
   */
  enabled: boolean;

  /**
   * Determines whether to use simple math or slightly more complex
   * math to calculate how to launch the blocks.
   */
  simpleMath: boolean;

  /**
   * Determines whether to place the block once it hits the ground.
   */
  placeWhenHitGround: boolean;

  /**
   * Determines whether to drop the block item and be removed when it cannot be placed,
   * otherwise it will be kept in the world.
   * (this is only used when "placeWhenHitGround" is enabled).
   * Note: This will not drop the items from the block as if it was properly broken.
   * The drop may also not match what it was before becoming a block entity. (for example, andesite -> stone)
   * Requires dotiledrops gamerule to be enabled.
   */
  dropWhenUnplaceable: boolean;

  /**
   * Determines whether to allow the block to collide with other entities,
   * this allows players and entities to stand on it. This may cause more
   * lag as a second entity is required per block.
   */
  collideWithEntities: boolean;

  /**
   * Determines whether to despawn the block after 5 seconds, if disabled,
   * the blocks will not despawn and will need to be removed via
   * `/event entity @e[type=bp:entity_block] despawn`.
   */
  despawnTimer: boolean;

  /**
   * Determines whether to rotate the blocks when they are moving.
   */
  rotateWithVelocity: boolean;

  /**
   * Determines what blocks to ignore, this is helpful for ignoring any blocks that may have issues when being placed down.
   */
  ignoreBlocks: string[];

  /**
   * Determines what blocks to allow blocks to replace when being placed.
   */
  replaceBlocks: string[];
  /**
   * Modifies the vertical launch velocity of blocks. (this value is added to the vertical velocity)
   */
  additionalVerticalVelocity: number;

  /**
   * Modifies the vertical launch velocity of blocks. (the vertical velocity is multiplied by this value)
   */
  verticalVelocityModifier: number;

  /**
   * Modifies the horizontal launch velocity of blocks. (the horizontal velocity is multiplied by this value)
   */
  horizontalVelocityModifier: number;

  /**
   * Determines the minimum amount of entity blocks to spawn per explosion during a tick before continuing on the next tick.
   */
  minBlocksToSpawnPerTick: number;
};