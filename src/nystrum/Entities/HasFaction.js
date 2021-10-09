export const HasFaction = superclass => class extends superclass {
  constructor({ faction = null, enemyFactions = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_FACTION');
    this.faction = faction;
    this.enemyFactions = enemyFactions;
  }

  getEnemies () {
    return this.game.engine.actors
      .filter((actor) => this.enemyFactions.includes( actor['faction']))
  }
};
