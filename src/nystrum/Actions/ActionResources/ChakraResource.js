import {ActionResource} from './ActionResource';

export class ChakraResource extends ActionResource {
  constructor({ ...args }) {
    super({ ...args });
    this.name = 'Chakra';
    this.actorResourcePath = 'charge';
    this.renderer = { color: '#224c92', background: '#13b8d7', character: '' }
  }
}