import {ActionResource} from './ActionResource';

export class UpgradeResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Upgrade Points';
    this.actorResourcePath = 'upgrade_points';
    this.renderer = { color: 'white', background: '#3e7dc9', character: '^', sprite: '' }
  }
}