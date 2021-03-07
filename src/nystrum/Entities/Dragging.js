import * as Helper from '../../helper'; 

export const Dragging = superclass => class extends superclass {
  constructor({ draggedEntity = null, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('DRAGGING');
    this.draggedEntity = draggedEntity;
  }
  grab(pos) {
    const tile = this.game.map[Helper.coordsToString(pos)];
    if (!tile)
      return false;
    if (tile.entities.length > 0) {
      const entity = tile.entities[0];
      if (entity.entityTypes.includes('DRAGGABLE'))
        if (!this.draggedEntity && entity.draggable === true) {
          this.draggedEntity = entity;
          return true;
        }
    }
    return false;
  }
  release() {
    if (!this.draggedEntity)
      return false;
    const draggedEntity = { ...this.draggedEntity };
    this.draggedEntity = null;
    return draggedEntity;
  }
  drag(lastPos) {
    // update entity position
    const pos = this.draggedEntity.pos;
    // get tile of draged entity
    let tile = this.game.map[Helper.coordsToString(pos)];
    // remove dragged entity from that tile
    this.game.map[Helper.coordsToString(pos)] = { ...tile, entities: tile.entities.filter((e) => e.id !== this.draggedEntity.id) };
    // update dragged ent to player's position
    this.draggedEntity.pos = lastPos;
    // add dragged ent to new tile
    this.game.map[Helper.coordsToString(lastPos)].entities.push(this.draggedEntity);
  }
  move(targetPos) {
    const lastPos = { ...this.pos };
    if (this.draggedEntity) {
      const moveSuccess = super.move(targetPos);
      if (moveSuccess) {
        this.drag(lastPos);
        return true;
      }
      return moveSuccess;
    }
    return super.move(targetPos);
  }
};
