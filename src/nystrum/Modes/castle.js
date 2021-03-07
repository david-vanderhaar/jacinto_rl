import * as Constant from '../constants';
import * as Helper from '../../helper';
import * as Item from '../items';
import * as MapHelper from '../Maps/helper';
import { generate as generateBuilding } from '../Maps/generator';
import { FireSpread, Speaker, Debris, Bandit, RangedBandit } from '../Entities/index';
import { MESSAGE_TYPE } from '../message';
import { Mode } from './default';
import SOUNDS from '../sounds';
import Konva from 'konva';

const MAP_DATA = require('../Maps/castle.json');

export class Castle extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.data = {
      level: 1,
      highestLevel: null,
      fireIntensity: 0, // increase this number to increase fire spread
      npcCount: 1,
      creatureCount: 1,
      turnCount: 0,
    };
  }

  initialize () {
    super.initialize();
    this.game.createEmptyLevel();
    this.game.initializeMapTiles();
    // this.game.createCustomLevel(MAP_DATA);
    
    this.setWaveData(this.data.level);
    const offsetX = Math.floor(this.game.mapWidth / 2)
    const offsetY = Math.floor(this.game.mapHeight / 2)
    // generateBuilding(this.game.map, 2, 2, 1, 18);
    // generateBuilding(this.game.map, 10, 10, 2, 4);
    // generateBuilding(this.game.map, offsetX, offsetY, 2, 4);
    let padding = 3;
    MapHelper.addTileZone(
      { x: padding, y: padding },
      this.game.mapHeight - (padding * 2),
      this.game.mapWidth - (padding * 2),
      'WALL',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    padding = 4
    MapHelper.addTileZone(
      { x: padding, y: padding },
      this.game.mapHeight - (padding * 2),
      this.game.mapWidth - (padding * 2),
      'FLOOR',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    padding = 5;
    MapHelper.addTileZone(
      { x: padding, y: padding },
      this.game.mapHeight - (padding * 2),
      this.game.mapWidth - (padding * 2),
      'WALL',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    padding = 6
    MapHelper.addTileZone(
      { x: padding, y: padding },
      this.game.mapHeight - (padding * 2),
      this.game.mapWidth - (padding * 2),
      'GROUND',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );

    MapHelper.addTileZone(
      { x: 31, y: 9 },
      4,
      4,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    generateBuilding(this.game.map, 10, 10, 2, 4);


    this.placeInitialItems();
    this.placePlayersInSafeZone();
    let floorTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'FLOOR')
    for (let index = 0; index < this.data.npcCount; index++) {
      let pos = Helper.getRandomInArray(floorTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addNPC({ x: posXY[0], y: posXY[1] });
    }
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    for (let index = 0; index < this.data.creatureCount; index++) {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addEnemy({ x: posXY[0], y: posXY[1] });
    }
  }

  update () {
    super.update();
    this.propogateFire();
    this.burnEntities();
    if (this.hasLost()) {
      this.reset();
      this.game.initializeGameData();
    }
    // triggerd once all npcs are saved
    if (this.hasWon()) {
      this.nextLevel();
      this.beginNextWave();
      this.game.initializeGameData();
    }
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
    this.setLevel(1);
    this.initialize();
  }

  setWaveData (level) {
    switch (level) {
      case 1:
        this.data.creatureCount = 0;
        this.data.npcCount = 1;
        break;
      case 2:
        this.data.creatureCount = 5;
        this.data.npcCount = 1;
        break;
      case 3:
        this.data.creatureCount = 10;
        this.data.npcCount = 1;
        break;
      default:
        this.data.creatureCount = 20;
        this.data.npcCount = 1;
        break;
    }
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
    // this.game.draw();
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
      // this.game.draw();
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
      // this.game.draw();
    };
  }

  getBanditStats () {
    let banditLevels = [
      {
        name: 'Slingshot',
        renderer: {
          character: Helper.getRandomInArray(['r']),
          color: '#ced5dd',
          background: '',
        },
        durability: 1,
        attackDamage: 1,
        speed: 100,
        entityClass: RangedBandit
      },
      {
        name: 'Buckshot',
        renderer: {
          character: Helper.getRandomInArray(['r']),
          color: '#3fc072',
          background: '',
        },
        durability: 2,
        attackDamage: 1,
        speed: 200,
        entityClass: RangedBandit
      },
      {
        name: 'Ross',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#ced5dd',
          background: '',
        },
        durability: 1,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Kevin',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#3fc072',
          background: '',
        },
        durability: 2,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Jacob',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#67a1d7',
          background: '',
        },
        durability: 3,
        attackDamage: 1,
        speed: 100,
        entityClass: Bandit
      },
      {
        name: 'Jarod',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#e16264',
          background: '',
        },
        durability: 1,
        attackDamage: 5,
        speed: 300,
        entityClass: Bandit
      },
      {
        name: 'Bigii',
        renderer: {
          character: Helper.getRandomInArray(['b']),
          color: '#9f62e1',
          background: '',
        },
        durability: 15,
        attackDamage: 10,
        speed: 100,
        entityClass: Bandit
      },
    ]
    return Helper.getRandomInArray(banditLevels);
  }

  addEnemy (pos) {
    let players = this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
    let targetEntity = players[0]
    const banditStats = this.getBanditStats();
    let entity = new banditStats.entityClass({
      targetEntity,
      pos,
      renderer: banditStats.renderer,
      name: banditStats.name,
      game: this.game,
      actions: [],
      attackDamage: banditStats.attackDamage,
      durability: banditStats.durability,
      speed: banditStats.speed,
      // directional projectile destruction breaks engine
      getProjectile: ({ pos, targetPos, direction, range }) => Item.directionalKunai(this.game.engine, { ...pos }, direction, range)
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
    })
    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
      // this.game.draw();
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
