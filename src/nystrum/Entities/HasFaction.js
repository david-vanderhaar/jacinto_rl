export const HasFaction = superclass => class extends superclass {
  constructor({ faction = null, enemyFactions = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_FACTION');
    this.faction = faction;
    this.enemyFactions = enemyFactions;
  }

  // Overriding Attacking
  canAttack (entity) {
    return !this.isAlly(entity)
  }

  // Overriding RangedAttacking
  canRangedAttack(entity) {
    return !this.isAlly(entity)
  }

  getEnemies () {
    return this.game.engine.actors
      .filter((actor) => this.enemyFactions.includes( actor['faction']))
  }

  isEnemy (actor) {
    return this.enemyFactions.includes( actor['faction'])
  }

  isAlly (actor) {
    return actor['faction'] === this.faction;
  }
};
