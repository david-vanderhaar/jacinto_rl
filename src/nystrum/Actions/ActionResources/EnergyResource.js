import {ActionResource} from './ActionResource';

export class EnergyResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Energy';
    this.actorResourcePath = 'energy';
    this.renderer = { color: 'black', background: '#ff9926', character: '' }
  }
}