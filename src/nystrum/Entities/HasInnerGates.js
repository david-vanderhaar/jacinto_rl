export const HasInnerGates = superclass => class extends superclass {
  constructor({ currentGate = null, gates = [], ...args }) {
    super({ ...args });
    this.entityTypes = this.entityTypes.concat('HAS_INNER_GATES');
    this.currentGate = currentGate;
    this.gates = [
      {
        name: 'Gate of Opening',
        damageBuff: 1,
        buffValue: 100,
        durabilityDebuff: 1,
        character: '1'
      },
      {
        name: 'Gate of Healing',
        damageBuff: 1,
        buffValue: 100,
        durabilityDebuff: 1,
        character: '2'
      },
      {
        name: 'Gate of Life',
        damageBuff: 1,
        buffValue: 100,
        durabilityDebuff: 1,
        character: '3'
      },
      {
        name: 'Gate of Pain',
        damageBuff: 1,
        buffValue: 100,
        durabilityDebuff: 1,
        character: '4'
      },
      {
        name: 'Gate of Limit',
        damageBuff: 1,
        buffValue: 100,
        durabilityDebuff: 1,
        character: '5'
      },
    ];
  }
  setNextGate() {
    let currentGate = this.currentGate;
    let nextGate = null;
    if (!currentGate) {
      nextGate = this.gates[0];
      this.currentGate = { ...nextGate };
    }
    else {
      let nextGateIndex = this.gates.findIndex((gate) => currentGate.name === gate.name) + 1;
      if (this.gates.length > nextGateIndex) {
        nextGate = this.gates[nextGateIndex];
        this.currentGate = { ...nextGate };
      }
    }
    return nextGate;
  }
  getNextGate() {
    let currentGate = this.currentGate;
    let nextGate = null;
    if (!currentGate) {
      nextGate = this.gates[0];
    }
    else {
      let nextGateIndex = this.gates.findIndex((gate) => currentGate.name === gate.name) + 1;
      if (this.gates.length > nextGateIndex) {
        nextGate = this.gates[nextGateIndex];
      }
    }
    return nextGate;
  }
};
