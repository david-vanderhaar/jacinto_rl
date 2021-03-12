import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
import { generate as generateBuilding } from '../../Maps/generator';
import { CoverWall, Debris, Bandit, RangedBandit, EmergenceHole } from '../../Entities/index';
import { MESSAGE_TYPE } from '../../message';
import { Mode } from '../default';
import SOUNDS from '../../sounds';
import * as _ from 'lodash';
import {COLORS, TILE_KEY} from './theme';

export class Jacinto extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    this.data = {
      level: 1,
      highestLevel: null,
      turnCount: 0,
    };
    this.dataByLevel = [
      {
        enemies: Array(1).fill('Bandit'),
        // enemies: Array(10).fill('Bandit'),
      },
      {
        enemies: Array(10).fill('Bandit'),
      },
    ]
  }

  initialize () {
    super.initialize();
    this.game.tileKey = TILE_KEY
    this.game.createEmptyLevel();
    this.game.initializeMapTiles();
    
    this.setWaveData();
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 31, y: 9 },
      4,
      4,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    generateBuilding(this.game.map, 10, 10, 2, 4);
    generateBuilding(this.game.map, 20, 5, 6, 4);

    this.placePlayersInSafeZone();
    let groundTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'GROUND')
    this.data.enemies.forEach((enemyName) => {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
    })

    // let floorTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'FLOOR')
    for (let index = 0; index < 20; index++) {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addCover({ x: posXY[0], y: posXY[1] });
    }

    for (let index = 0; index < 2; index++) {
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addEmerenceHole({ x: posXY[0], y: posXY[1] });
    }
  }

  getPlayers () {
    return this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  updateUI() {
    _.each(this.getPlayers(), (player, index) => {
      const currentBlips = Math.floor(player.energy / 100);
      const maxBlips = Math.floor(player.speed / 100);
      const arr = [
        ...Array(currentBlips).fill(''),
        ...Array(maxBlips - currentBlips).fill('_'),
      ];
      this.createOrUpdateInfoBlock(`playerSpeed${player.id}`, { text: `${player.name} | AP: ${arr.join(' ')}` })
      // this.createOrUpdateInfoBlock(`playerSpeed`, { text: `AP: ${player.energy}/${player.speed}` })
    })
  }

  update () {
    super.update();
    // this.updateUI();
    if (this.hasWon()) {
      this.game.toWin()
    }
    if (this.hasLost()) {
      SOUNDS.lose.play();
      this.game.toLose();
      this.reset();
      this.game.initializeGameData();
    }
    if (this.levelComplete()) {
      this.nextLevel();
      this.setWaveData();
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

  setWaveData () {
    const level = this.data.level - 1
    const nextLevelData = _.get(this.dataByLevel, level, {});
    this.data = {...this.data, ...nextLevelData}
  }

  levelComplete () {
    return this.game.engine.actors.length === 1; 
  }

  hasWon () {
    return this.data.level > this.dataByLevel.length;
  }

  hasLost () {
    let players = this.getPlayers()
    if (!players.length) return true;
    else if (players.length) {
      if (players[0].durability <= 0) {
        return true;
      }
    }
    return false;
  }

  addEmerenceHole(pos) {
    MapHelper.addTileZone(
      this.game.tileKey,
      {x: pos.x - 1, y: pos.y - 1},
      3,
      3,
      'EMERGENCE_GROUND',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    // create new fire actor and place
    let entity = new EmergenceHole({
      name: 'Hole',
      pos,
      game: this.game,
      passable: true,
      renderer: {
        character: '',
        sprite: '',
        color: COLORS.locust1,
        background: COLORS.base04,
      },
      timeToSpread: 1,
      spreadCount: 10,
      durability: 1,
      speed: Constant.ENERGY_THRESHOLD,
      getSpawnedEntity: (spawnPosition) => {
        let players = this.getPlayers()
        let targetEntity = players[0]
        const banditStats = this.getBanditStats();
        let entity = new banditStats.entityClass({
          targetEntity,
          pos: spawnPosition,
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
        });

        return entity
      },
      onDestroy: () => this.game.map[Helper.coordsToString(pos)].type = 'EMERGENCE_DESTROYED',
    });

    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
      this.game.draw();
    };
  }

  addCover (
    pos,
    name = 'box',
    character = '%',
    durability = 5,
    background = COLORS.locust0
  ) {
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

    let box = new CoverWall({
      pos,
      renderer: {
        character,
        sprite,
        color: COLORS.locust2,
        background,
      },
      name,
      game: this.game,
      durability,
      accuracyModifer: -0.3,
      damageModifer: 0,
    })

    this.game.placeActorOnMap(box)
  }
  
  getBanditStats () {
    let banditLevels = [
      {
        name: 'Slingshot',
        renderer: {
          character: Helper.getRandomInArray(['d']),
          color: COLORS.flesh2,
          background: COLORS.flesh1,
          sprite: '',
          // sprite: '',
        },
        durability: 3,
        attackDamage: 1,
        speed: 100,
        entityClass: RangedBandit
      },
      {
        name: 'Ross',
        renderer: {
          character: Helper.getRandomInArray(['w']),
          color: COLORS.flesh1,
          background: COLORS.flesh3,
          sprite: '',
        },
        durability: 1,
        attackDamage: 1,
        speed: 500,
        entityClass: Bandit
      },
    ]
    return Helper.getRandomInArray(banditLevels);
  }

  addBandit (pos) {
    let players = this.getPlayers()
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

  placePlayersInSafeZone () {
    let players = this.getPlayers()
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
