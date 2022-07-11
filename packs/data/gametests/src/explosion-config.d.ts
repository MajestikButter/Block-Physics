/**
 * Enables or disables block explosion physics.
 */
export const enabled: boolean;

/**
 * Determines whether to use simple math or slightly more complex
 * math to calculate how to launch the blocks.
 */
export const simpleMath: boolean;

/**
 * Determines whether to place the block once it hits the ground.
 */
export const placeWhenHitGround: boolean;

/**
 * Determines whether to drop the block item and be removed when it cannot be placed,
 * otherwise it will be kept in the world.
 * (this is only used when "placeWhenHitGround" is enabled).
 * Note: This will not drop the items from the block as if it was properly broken.
 * The drop may also not match what it was before becoming a block entity. (for example, andesite -> stone)
 */
export const dropWhenUnplaceable: boolean;

/**
 * Determines whether to allow the block to collide with other entities,
 * this allows players and entities to stand on it. This may cause more
 * lag as a second entity is required per block.
 */
export const collideWithEntities: boolean;

/**
 * Determines whether to despawn the block after 5 seconds, if disabled,
 * the blocks will not despawn and will need to be removed via
 * `/event entity @e[type=bp:entity_block] despawn`.
 */
export const despawnTimer: boolean;

/**
 * Modifies the vertical launch velocity of blocks. (this value is added to the vertical velocity)
 */
export const additionalVerticalVelocity: number;

/**
 * Modifies the vertical launch velocity of blocks. (the vertical velocity is multiplied by this value)
 */
export const verticalVelocityModifier: number;

/**
 * Modifies the horizontal launch velocity of blocks. (the horizontal velocity is multiplied by this value)
 */
export const horizontalVelocityModifier: number;

/**
 * Determines whether to rotate the blocks when they are moving.
 */
export const rotateWithVelocity: boolean;
