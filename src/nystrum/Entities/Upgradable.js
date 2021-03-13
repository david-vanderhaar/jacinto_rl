export const Upgrade = ({
  activate = (actor) => null,
  canUpgrade = (actor) => true,
  cost = 1,
  name = 'upgrade',
  removeOnActivate = false,
}) => {
  return {
    activate,
    canUpgrade,
    cost,
    name,
    removeOnActivate,
  }
}

export const Upgradable = superclass => class extends superclass {
  constructor({ upgrade_points = 0, upgrade_tree = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('UPGRADABLE');
    this.upgrade_points = upgrade_points;
    this.upgrade_tree = upgrade_tree;
  }

  upgrade (upgrade) {
    if (upgrade.canUpgrade(this)) {
      upgrade.activate(this);
      if (upgrade.removeOnActivate) {
        const newTree = this.upgrade_tree.filter((currUpgrade) => currUpgrade.name !== upgrade.name);
        this.upgrade_tree = newTree;
      }
      return true;
    }
    return false;
  }
};
