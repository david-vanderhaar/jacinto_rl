export const die = (engine) => {
  let actor = engine.actors[engine.currentActor];
  actor.destroy();
}