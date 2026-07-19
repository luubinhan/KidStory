import { DisplacementFilter, Sprite, Application, type Filter } from "pixi.js";

function appendStageFilter(app: Application, filter: Filter): void {
  const current = app.stage.filters;
  app.stage.filters = current ? [...current, filter] : [filter];
}

export function addDisplacementEffect(app: Application) {
  // Create a sprite from the preloaded displacement asset.
  const sprite = Sprite.from("displacement");

  // Set the base texture wrap mode to repeat to allow the texture UVs to be tiled and repeated.
  sprite.texture.source.wrapMode = "repeat";

  // Create a displacement filter using the sprite texture.
  const filter = new DisplacementFilter({
    sprite,
    scale: 50,
  });

  appendStageFilter(app, filter);
}
