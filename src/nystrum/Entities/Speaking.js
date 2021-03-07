import { Say } from '../Actions/Say';

export const Speaking = superclass => class extends superclass {
  constructor({ messages = ['I have nothing to say.'], messageType, ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('SPEAKING');
    this.messages = messages;
    this.messageType = messageType;
  }
  getAction(game) {
    const message = this.messages.shift();
    this.messages.push(message);
    return new Say({
      actor: this,
      game,
      message: message,
      messageType: this.messageType,
      processDelay: 0,
    });
  }
};
