export class ActionResource {
  constructor({
    name = 'Resource',
    getResourceCost = () => null,
    resourceIncrement = 1,
    actorResourcePath = null,
    actorResourceGetter = null,
    actorResourceSetter = null,
    renderer = {background: 'transparent', color: 'black', character: '*'}
  }) {
    this.name = name;
    this.getResourceCost = getResourceCost;
    this.resourceIncrement = resourceIncrement;
    this.actorResourcePath = actorResourcePath;
    this.actorResourceGetter = actorResourceGetter;
    this.actorResourceSetter = actorResourceSetter;
    this.renderer = renderer;
    this.getResourceCostDisplay = () => this.getResourceCost() / this.resourceIncrement
  }

}
