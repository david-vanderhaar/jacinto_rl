import {CLONE_PATTERNS} from '../constants';
import {getPositionsFromStructure} from '../../helper';
export const HasShapePattern = superclass => class extends superclass {
  constructor({ shapePattern = CLONE_PATTERNS.point, ...args }) {
    super({ ...args });
    this.shapePattern = shapePattern;
    this.entityTypes = this.entityTypes.concat('HAS_SHAPE_PATTERN');
  }

  getPositionsInShape (pos) {
    return getPositionsFromStructure(this.shapePattern, pos);
  }
};
