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
    return this.game.engine.actors.filter((actor) => this.isEnemy(actor))
  }

  isEnemy (actor) {
    if (this.isAlly(actor)) return false
    return this.considersAllAsEnemy() || this.isEnemyFaction(actor)
  }

  considersAllAsEnemy() {
    return this.enemyFactions.includes('ALL')
  }

  isEnemyFaction(actor) {
    return this.enemyFactions.includes(actor['faction'])
  }

  isAlly (actor) {
    return actor['faction'] === this.faction;
  }
};
