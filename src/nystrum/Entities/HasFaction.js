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
    return (!this.isAlly(actor) && this.considersAllAsEnemy()) || this.isEnemyFaction(actor)
  }

  considersAllAsEnemy() {
    return this.enemyFactions.includes('ALL')
  }

  isEnemyFaction(actor) {
    this.enemyFactions.includes(actor['faction'])
  }

  isAlly (actor) {
    return actor['faction'] === this.faction;
  }
};
