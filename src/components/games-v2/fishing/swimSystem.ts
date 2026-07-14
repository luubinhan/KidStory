import type { PooledFish } from "./fishPool";

const EDGE_MARGIN = 60;
const BOB_AMPLITUDE = 8;
const MIN_SPEED = 40;
const MAX_SPEED = 120;
const Y_SPACING = 40;
const Y_PADDING = 40;
const SPAWN_ATTEMPTS = 12;

function randomSpeed(): number {
  const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED);
  return Math.random() < 0.5 ? -speed : speed;
}

function applyFlip(fish: PooledFish): void {
  const absScale = Math.abs(fish.sprite.scale.x) || 1;
  fish.sprite.scale.x = Math.sign(fish.vx || 1) * absScale;
}

/** Advances one fish's position for the frame: horizontal drift, vertical bob, and edge bounce. */
export function updateSwim(
  fish: PooledFish,
  dtSec: number,
  width: number,
  _height: number,
  timeSec: number,
): void {
  fish.root.x += fish.vx * dtSec;
  fish.root.y =
    fish.baseY + Math.sin(timeSec + fish.bobPhase) * BOB_AMPLITUDE;

  if (fish.root.x < -EDGE_MARGIN && fish.vx < 0) {
    fish.vx = Math.abs(fish.vx);
  } else if (fish.root.x > width + EDGE_MARGIN && fish.vx > 0) {
    fish.vx = -Math.abs(fish.vx);
  }

  applyFlip(fish);
}

/** Picks a spawn position/velocity for a (re)spawned fish, preferring a Y band away from `occupiedYs`. */
export function randomizeSpawn(
  fish: PooledFish,
  width: number,
  height: number,
  occupiedYs: number[],
): void {
  const minY = Y_PADDING;
  const maxY = Math.max(minY, height - Y_PADDING);
  const isTooClose = (candidate: number) =>
    occupiedYs.some((occupied) => Math.abs(occupied - candidate) < Y_SPACING);

  let y = minY + Math.random() * (maxY - minY);
  for (let attempt = 0; isTooClose(y) && attempt < SPAWN_ATTEMPTS; attempt++) {
    y = minY + Math.random() * (maxY - minY);
  }

  fish.baseY = y;
  fish.bobPhase = Math.random() * Math.PI * 2;
  fish.vx = randomSpeed();
  fish.root.x = Math.random() * width;
  fish.root.y = y;

  applyFlip(fish);
}
