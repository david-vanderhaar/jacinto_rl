import * as Constant from '../constants';
import * as Helper from '../../helper';
import * as Item from '../items';
import * as MapHelper from '../Maps/helper';
import { generate as generateBuilding } from '../Maps/generator';
import { FireSpread, Speaker, Debris } from '../Entities/index';
import { MESSAGE_TYPE } from '../message';
import { Mode } from './default';
import SOUNDS from '../sounds';

export class Flume extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.infoHeader = 'Save all of the citizens from the burning keep and get them to the safe zone!'
    this.data = {
      level: 1,
      highestLevel: null,
      fireIntensity: 1, // increase this number to increase fire spread
      npcCount: 1,
      debrisCount: 4,
      mediumDebrisCount: 3,
      heavyDebrisCount: 4,
      smallGasCanCount: 3,
      mediumGasCanCount: 0,
      largeGasCanCount: 1,
      turnCount: 0,
    };
  }

  initialize () {
    super.initialize();
    this.game.createEmptyLevel();
    this.game.initializeMapTiles();
    const offsetX = Math.floor(this.game.mapWidth / 2)
    const offsetY = Math.floor(this.game.mapHeight / 2)
    generateBuilding(this.game.map, offsetX, offsetY);
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 0, y: 0 },
      3,
      3,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    this.placeInitialItems();
    this.placePlayersInSafeZone();

    let array = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'FLOOR')
    for (let index = 0; index < this.data.debrisCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] });
    }
    for (let index = 0; index < this.data.mediumDebrisCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] }, 'Medium Sized Debris', 'm', 10, 0);
    }
    for (let index = 0; index < this.data.heavyDebrisCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] }, 'Heavy Sized Debris', 'H', 10, 0, false, false);
    }
    for (let index = 0; index < this.data.smallGasCanCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] }, 'gas can', 'Xs', 1, 1, true, true, Constant.THEMES.SOLARIZED.orange);
    }
    for (let index = 0; index < this.data.mediumCanCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] }, 'gas can', 'X', 1, 3, true, true, Constant.THEMES.SOLARIZED.orange);
    }
    for (let index = 0; index < this.data.largeGasCanCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addDebris({ x: posXY[0], y: posXY[1] }, 'gas can', 'XL', 1, 10, true, true, Constant.THEMES.SOLARIZED.orange);
    }
    for (let index = 0; index < this.data.fireIntensity; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addFire({ x: posXY[0], y: posXY[1] });
    }
    for (let index = 0; index < this.data.npcCount; index++) {
      let pos = Helper.getRandomInArray(array);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addNPC({ x: posXY[0], y: posXY[1] });
    }

    // ui
    this.updateUI()

    // sounds
    if (!SOUNDS.fire_1.playing()) SOUNDS.fire_1.play();    
  }

  checkRemoveSafeFloors () {
    const currentActor = this.game.engine.actors[this.game.engine.currentActor];
    if (currentActor.name !== Constant.PLAYER_NAME) return;

    this.data.turnCount += 1;
    if (this.data.turnCount > this.getSaveCountRequirement() * 50) {
      Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE_FLOOR').forEach((key) => {
        this.game.map[key].type = 'FLOOR';
      });

    }
  }

  update () {
    super.update();
    this.propogateFire();
    this.burnEntities();
    this.checkRemoveSafeFloors();
    this.updateUI()
    if (this.hasLost()) {
      this.reset();
      this.game.initializeGameData();
    }
    // triggerd once all npcs are saved
    if (this.hasWon()) {
      this.nextLevel();
      this.increaseIntensity()
      this.game.initializeGameData();
    }
  }

  updateUI () {
    this.createOrUpdateInfoBlock('levelProgress', { text: `${this.countNpcSafe()} of  ${this.getSaveCountRequirement()} are safe!` })
  }
  
  //Extras

  setLevel (level) {
    this.data.level = level;
    this.data.turnCount = 0;
  }

  nextLevel () {
    this.setLevel(this.data.level + 1);
  }

  reset () {
    this.resetIntensity();
    this.setLevel(1);
    this.initialize();
  }

  increaseIntensity () {
    switch (this.data.level) {

      case 2:
        this.data.fireIntensity = 2;
        this.data.npcCount = 1;
        this.data.debrisCount = 4;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 1;
        this.data.mediumGasCanCount = 1;
        this.data.largeGasCanCount = 1;
        break;
      case 3:
        this.data.fireIntensity = 3;
        this.data.npcCount = 2;
        this.data.debrisCount = 50;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 1;
        this.data.mediumGasCanCount = 2;
        this.data.largeGasCanCount = 1;
        break;
      case 4:
        this.data.fireIntensity = 4;
        this.data.npcCount = 2;
        this.data.debrisCount = 6;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 3;
        this.data.mediumGasCanCount = 2;
        this.data.largeGasCanCount = 1;
        break;
      case 5:
        this.data.fireIntensity = 5;
        this.data.npcCount = 3;
        this.data.debrisCount = 6;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 3;
        this.data.mediumGasCanCount = 1;
        this.data.largeGasCanCount = 1;
        break;
      case 6:
        this.data.fireIntensity = 4;
        this.data.npcCount = 3;
        this.data.debrisCount = 10;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 3;
        this.data.mediumGasCanCount = 1;
        this.data.largeGasCanCount = 1;
        break;
      case 7:
        this.data.fireIntensity = 1;
        this.data.npcCount = 3;
        this.data.debrisCount = 80;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 25;
        this.data.mediumGasCanCount = 1;
        this.data.largeGasCanCount = 1;
        break;
      case 8:
        this.data.fireIntensity = 3;
        this.data.npcCount = 3;
        this.data.debrisCount = 20;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.smallGasCanCount = 6;
        this.data.mediumGasCanCount = 1;
        this.data.largeGasCanCount = 1;
        break;
      case 9:
        this.game.toWin();
        break;
      default:
        this.data.fireIntensity = 3;
        this.data.npcCount = 3;
        this.data.debrisCount = 20;
        this.data.mediumDebrisCount = 4;
        this.data.heavyDebrisCount = 1
        this.data.gasCanCount = 5;
        break;
    }
  }

  resetIntensity () {
    this.data.fireIntensity = 1;
    this.data.npcCount = 1;
    this.data.debrisCount = 4;
  }

  countNpcSafe () {
    const helpless = this.game.engine.actors.filter((actor) => {
      if (actor.entityTypes.includes('HELPLESS')) {
        const tile = this.game.map[Helper.coordsToString(actor.pos)];
        if (tile.type === 'SAFE') {
          if (!actor.saved) actor.save();
          return true;
        }
      }
      return false
    });

    return helpless.length;
  }

  getSaveCountRequirement () {
    const minimum = Math.ceil(this.data.npcCount * 0.66);
    return Math.max(1, minimum);
  }

  hasWon () {
    return this.countNpcSafe() >= this.getSaveCountRequirement();
  }

  hasLost () {
    const helpless = this.game.engine.actors.filter((actor) => actor.entityTypes.includes('HELPLESS'));
    if (helpless.length < this.getSaveCountRequirement()) {
      SOUNDS.lose.play();
      this.game.toLose();
      return true;
    }
    return false;
  }

  addDebris (pos, name = 'box', character = '%', durability = 5, explosivity = 0, pushable = true, draggable = true, background = Constant.THEMES.SOLARIZED.base01) {
    let sprite = Helper.getRandomInArray(['', '', '', '', '', '']);
    switch (character) {
      case '%':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'm':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'H':
        sprite = Helper.getRandomInArray(['', '']);
        break;
      case 'Xs':
        sprite = ''
        break;
      case 'X':
        sprite = ''
        break;
      case 'XL':
        sprite = ''
        break;
      default:
        sprite = '';
        break;
    }

    let box = new Debris({
      pos,
      renderer: {
        character,
        sprite,
        color: Constant.THEMES.SOLARIZED.base2,
        background,
      },
      name,
      game: this.game,
      durability,
      explosivity,
      flammability: 0,
      draggable,
      pushable,
    })

    this.game.placeActorOnMap(box)
    this.game.draw();
  }

  addNPC (pos) {
    // create new entity and place
    let entity = new Speaker({
      name: Constant.NPC_NAME,
      // messages: SOLANGE.lyrics,
      messages: ['help!', 'ahh!', 'It\'s getting hot in hurr.'],
      messageType: MESSAGE_TYPE.ACTION,
      pos,
      game: this.game,
      renderer: {
        character: 'C',
        sprite: '',
        color: Constant.THEMES.SOLARIZED.base3,
        background: Constant.THEMES.SOLARIZED.violet,
      },
      durability: 2,
    })

    if (this.game.placeActorOnMap(entity)) {
      const tile = this.game.map[Helper.coordsToString(entity.pos)];
      tile.type = 'SAFE_FLOOR';
      this.game.engine.addActor(entity);
      this.game.draw();
    };
  }

  addFire (pos) {
    // create new fire actor and place
    let fire = new FireSpread({
      name: 'Pyro',
      pos,
      game: this.game,
      renderer: {
        character: '*',
        sprite: '',
        color: Constant.THEMES.SOLARIZED.base3,
        background: Constant.THEMES.SOLARIZED.red,
      },
      timeToSpread: 1,
      spreadCount: 1,
      durability: 1,
      attackDamage: 2,
      speed: 100,
    })

    if (this.game.placeActorOnMap(fire)) {
      this.game.engine.addActor(fire);
      this.game.draw();
    };
  }

  propogateFire () {
    const fires = this.game.engine.actors.filter((actor) => actor.name === 'Pyro')
    if (fires.length < this.data.fireIntensity) {
      // find burnt tile
      const keys = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'BURNT');
      const key = Helper.getRandomInArray(keys);
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        this.addFire(position)
      }
    }
  }

  burnEntities () {
    // burn all entiies on burning tiles
    const coordinates = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'BURNT');
    const entities = coordinates.reduce((acc, curr) => acc.concat(this.game.map[curr].entities), []);
    entities.forEach((ent) => {
      if (ent.entityTypes.includes('BURNABLE')) {
        const burned = ent.burn();
        if (burned) this.game.addMessage(`${ent.name} is burned.`, MESSAGE_TYPE.DANGER);
        if (ent.willResetCanBurn) ent.resetCanBurn();
      }
    })
  }

  placeInitialItems () {
    let objects = [
      Item.axe(this.game.engine),
      Item.waterGun(this.game.engine),
      Item.fireJacket(this.game.engine),
    ];

    const keys = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE');

    objects.forEach((item) => {
      const key = keys.pop();
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        item.pos = position;
        let tile = this.game.map[key];
        if (tile) {
          tile.entities.push(item);
        }
      }
    })
  }

  placePlayersInSafeZone () {
    let players = this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
    const keys = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE');
    players.forEach((player) => {
      const key = keys.shift();
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        player.pos = position;
        let tile = this.game.map[key];
        if (tile) {
          tile.entities.push(player);
        }
      }
    })
  }

}
