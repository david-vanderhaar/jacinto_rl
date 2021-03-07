import * as Helper from '../../helper';

export const Rendering = superclass => class extends superclass {
  constructor({ pos = { x: 0, y: 0 }, renderer, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('RENDERING');
    this.pos = pos;
    this.renderer = { ...renderer };
    this.currentFrame = 0;
  }

  getRenderer() {
    return this.renderer
  }

  getPosition() {
    return this.pos;
  }
  move(targetPos) {
    let success = false;
    if (this.game.canOccupyPosition(targetPos, this)) {
      let tile = this.game.map[Helper.coordsToString(this.pos)];
      this.game.map[Helper.coordsToString(this.pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.id) };
      this.pos = targetPos;
      this.game.map[Helper.coordsToString(targetPos)].entities.push(this);
      success = true;
    }
    return success;
  }
  shove(targetPos, direction) {
    let success = false;
    let targetTile = this.game.map[Helper.coordsToString(targetPos)];
    if (targetTile) {
      targetTile.entities.map((entity) => {
        if (entity.entityTypes.includes('PUSHABLE')) {
          if (!entity.passable && entity.pushable) {
            let newX = entity.pos.x + direction[0];
            let newY = entity.pos.y + direction[1];
            let newPos = { x: newX, y: newY };
            entity.move(newPos);
          }
        }
      });
    }
    success = this.move(targetPos);
    return success;
  }
};
