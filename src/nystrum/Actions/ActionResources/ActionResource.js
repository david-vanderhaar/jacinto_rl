export class ActionResource {
  constructor({
    name = 'Resource',
    getResourceCost = () => null,
    actorResourcePath = null,
    actorResourceGetter = null,
    actorResourceSetter = null,
    renderer = {background: 'transparent', color: 'black', character: '*'}
  }) {
    this.name = name;
    this.getResourceCost = getResourceCost;
    this.actorResourcePath = actorResourcePath;
    this.actorResourceGetter = actorResourceGetter;
    this.actorResourceSetter = actorResourceSetter;
    this.renderer = renderer;
  }
}
