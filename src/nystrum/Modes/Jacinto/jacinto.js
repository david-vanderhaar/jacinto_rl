import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
import { generate as generateBuilding } from '../../Maps/generator';
import * as CoverGenerator from '../../Maps/coverGenerator';
import { CoverWall, Debris, Bandit, RangedBandit, EmergenceHole } from '../../Entities/index';
import * as Behaviors from '../../Entities/AI/Behaviors';
import { MESSAGE_TYPE } from '../../message';
import { Mode } from '../default';
import SOUNDS from '../../sounds';
import * as _ from 'lodash';
import {COLORS, TILE_KEY} from './theme';
import { Ammo } from '../../Items/Pickups/Ammo';
import { Grenade } from '../../Items/Weapons/Grenade';
import {addWretch} from './Actors/Grubs';
const MAP_DATA = require('../../Maps/castle.json');

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
        // enemies: Array(4).fill('Grub'),
        enemies: Array(1).fill('Wretch'),
        emergenceHoles: 0,
        ammoLoot: 2,
        grenadeLoot: 1,
      },
      {
        enemies: Array(6).fill('Grub'),
        emergenceHoles: 3,
        ammoLoot: 1,
        grenadeLoot: 0,
      },
      {
        enemies: Array(12).fill('Grub'),
        emergenceHoles: 0,
        ammoLoot: 3,
        grenadeLoot: 1,
      },
      {
        enemies: [],
        emergenceHoles: 5,
        ammoLoot: 2,
        grenadeLoot: 0,
      },
      {
        enemies: Array(10).fill('Grub'),
        emergenceHoles: 4,
        ammoLoot: 1,
        grenadeLoot: 0,
      },
      {
        enemies: [],
        emergenceHoles: 12,
        ammoLoot: 20,
        grenadeLoot: 5,
      },
      {
        enemies: [...Array(4).fill('Grub'), 'Skorge'],
        emergenceHoles: 6,
        ammoLoot: 20,
        grenadeLoot: 2,
      },
    ]
  }

  createHorizontalRoad (y, length, x = 0) {
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y},
      4,
      length,
      'ROAD_EDGE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y: y + 1},
      2,
      length,
      'ROAD',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

  createVerticalRoad (x, length, y = 0) {
    MapHelper.addTileZone(
      this.game.tileKey,
      { x, y },
      length,
      3,
      'ROAD_EDGE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: x + 1, y },
      length,
      1,
      'ROAD',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

  createVerticalRoadGoingNorthAndSouth = () => (x) => this.createVerticalRoad(x, this.game.mapHeight);
  createVerticalRoadGoingNorth = (fromY) => (x) => this.createVerticalRoad(x, (fromY) + 1);
  createVerticalRoadGoingSouth = (fromY) => (x) => this.createVerticalRoad(x, (this.game.mapHeight - fromY) - 1, (fromY) + 1);

  createCityBlockLevel (numberOfVerticalRoads, numberOfBuildings) {
    // Generates the main road
    const mainRoadY = this.game.mapHeight / 4
    this.createHorizontalRoad(mainRoadY, this.game.mapWidth)

    // Generates roads to run the height of the map
    Array(numberOfVerticalRoads).fill('').forEach(() => {
      const x = Helper.getRandomIntInclusive(0, this.game.mapWidth);
      const generateRoad = Helper.getRandomInArray([
        this.createVerticalRoadGoingNorth(mainRoadY),
        this.createVerticalRoadGoingSouth(mainRoadY),
        this.createVerticalRoadGoingNorthAndSouth(mainRoadY),
      ]);
      generateRoad(x)
    })

    Array(numberOfBuildings).fill('').forEach(() => {
      let groundTiles = this.getEmptyGroundTileKeys()
      let pos = Helper.getRandomInArray(groundTiles);
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      const unitCount = Helper.getRandomIntInclusive(1, 6);
      // const unitCount = 4
      const unitSize = Helper.getRandomInArray([3, 4, 6]);
      generateBuilding(this.game.map, posXY[0], posXY[1], unitCount, unitSize);
    })
  }

  initialize () {
    super.initialize();
    this.game.tileKey = TILE_KEY
    this.game.createEmptyLevel();
    this.game.initializeMapTiles();
    // this.game.createCustomLevel(MAP_DATA);

    this.setWaveData();

    // Generates a safe zone on left-hand edge of map for player to start
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: 0, y: 0 },
      this.game.mapHeight,
      1,
      'SAFE',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  
    const numberOfVerticalRoads = Helper.getRandomIntInclusive(0, 5);
    const numberOfBuildings = Helper.getRandomIntInclusive(0, 10);
    this.createCityBlockLevel(numberOfVerticalRoads, numberOfBuildings);

    let floorTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'FLOOR')

    this.placePlayersInSafeZone();
    const player = this.game.getFirstPlayer();
    if (player) player.upgrade_points += 1;

    // adding emergence holes
    for (let index = 0; index < this.data.emergenceHoles; index++) {
      let pos = Helper.getRandomInArray(this.getEmptyTileKeys());
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addEmerenceHole({ x: posXY[0], y: posXY[1] });
    }

    // adding cover blocks
    const numberOfCoverStructures = 5 + this.data.enemies.length;
    
    let coverEligibleTiles = Object.keys(this.game.map).filter((key) =>  ['ROAD', 'DOOR', 'EMERGENCE_GROUND'].includes(this.game.map[key].type))
    for (let index = 0; index < numberOfCoverStructures; index++) {
      let pos = Helper.getRandomInArray(coverEligibleTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      const position = { x: posXY[0], y: posXY[1] };
      CoverGenerator.generateRandom(position, this.game);
    }

    // adding  ammo loot
    for (let index = 0; index < this.data.ammoLoot; index++) {
      let pos = Helper.getRandomInArray(floorTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addAmmoLoot({ x: posXY[0], y: posXY[1] });
    }

    // adding  grenade loot
    for (let index = 0; index < this.data.grenadeLoot; index++) {
      let pos = Helper.getRandomInArray(floorTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addGrenadeLoot({ x: posXY[0], y: posXY[1] });
    }

      // adding enemies
    this.data.enemies.forEach((enemyName) => {
      let pos = Helper.getRandomInArray(this.getEmptyGroundTileKeys());
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this[`add${enemyName}`]({ x: posXY[0], y: posXY[1] });
    })
  }

  // TODO curry these funcs
  getEmptyTileKeys (keys = Object.keys(this.game.map)) {
    return keys.filter((key) => !!!this.game.map[key].entities.length)
  }

  getEmptyGroundTileKeys (keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'GROUND')
  }

  getEmptyFloorTileKeys (keys = Object.keys(this.game.map)) {
    return this.getEmptyTileKeys(keys).filter((key) => this.game.map[key].type === 'FLOOR')
  }

  getPlayers () {
    return this.game.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  updateUI() {
    this.createOrUpdateInfoBlock(
      'gameProgress',
      { 
        text: `${this.data.level - 1} of  ${this.dataByLevel.length} city blocks cleared.` 
      }
    );
  }

  checkCoverAnimations() {
    this.game.engine.actors.forEach((actor) => {
      if (actor.entityTypes.includes('USES_COVER')) {
        if (actor.resetCoverAnimations());
      }
    })
  }

  update () {
    super.update();
    this.checkCoverAnimations();
    this.updateUI();
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

      // a hack to persist player data
      // this would persist all existing actors however
      this.initialize();
      // this.game.initializeGameData();
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
    const playerOnExit = this.playerIsOnExit();
    const enemiesDefeated = this.enemiesDefeated();
    if (enemiesDefeated) {
      this.activateExitTiles();
    }
    return playerOnExit && enemiesDefeated; 
  }

  enemiesDefeated () {
    return this.game.engine.actors.filter((actor) => actor['faction'] === 'LOCUST').length <= 0
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
      spreadCount: 3,
      durability: 1,
      faction: 'LOCUST',
      enemyFactions: ['COG'],
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
          faction: 'LOCUST',
          enemyFactions: ['COG'],
          onDestroy: (actor) => {
            const chance = Math.random();
            if (chance <= 0.05) {
              this.addAmmoLoot(actor.getPosition());
            } else if (chance <= 0.1) {
              this.addGrenadeLoot(actor.getPosition());
            }
          },
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

  createAmmoStack(amount, pos) {
    return Array(amount).fill('').map((i) => {
      const ammo = Ammo(this.game.engine);
      ammo.pos = pos;
      return ammo;
    });
  }

  addAmmoLoot (pos) {
    this.createAmmoStack(5, pos).forEach((entity) => {
      this.game.placeActorOnMap(entity)
    })
  }

  addGrenadeLoot (pos) {
    const entity = Grenade(this.game.engine, 6);
    entity.pos = pos;
    this.game.placeActorOnMap(entity)
  }

  getBanditStats () {
    let banditLevels = [
      {
        name: 'Grub',
        renderer: {
          character: Helper.getRandomInArray(['g']),
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
        name: 'Grub Scout',
        renderer: {
          character: Helper.getRandomInArray(['s']),
          color: COLORS.flesh1,
          background: COLORS.flesh2,
          sprite: '',
          // sprite: '',
        },
        durability: 1,
        attackDamage: 1,
        speed: 500,
        entityClass: RangedBandit
      },
      {
        name: 'Wretch',
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
      {
        name: 'Big Grub',
        renderer: {
          character: Helper.getRandomInArray(['B']),
          color: COLORS.locust2,
          background: COLORS.flesh1,
          sprite: '',
        },
        durability: 4,
        attackDamage: 3,
        speed: 100,
        entityClass: Bandit
      },
    ]
    return Helper.getRandomInArray(banditLevels);
  }

  addWretch (pos) {addWretch(this, pos)}

  addGrub (pos) {
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
      behaviorClasses: [
        Behaviors.MoveTowardsCover,
        Behaviors.TelegraphAttack,
        Behaviors.ExecuteAttack,
      ],
      faction: 'LOCUST',
      enemyFactions: ['COG'],
      onDestroy: (actor) => {
        const chance = Math.random();
        if (chance <= 0.05) {
          this.addAmmoLoot(actor.getPosition());
        } else if (chance <= 0.1) {
          this.addGrenadeLoot(actor.getPosition());
        }
      },
      // directional projectile destruction breaks engine
      getProjectile: ({ pos, targetPos, direction, range }) => Item.directionalKunai(this.game.engine, { ...pos }, direction, range)
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
    })
    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
      // this.game.draw();
    };
  }
  
  addSkorge (pos) {
    let players = this.getPlayers()
    let targetEntity = players[0]
    let entity = new Bandit({
      targetEntity,
      pos,
      renderer: {
        sprite: '',
        character: 'S',
        color: COLORS.flesh1,
        background: COLORS.base04,
      },
      name: 'Skorge',
      game: this.game,
      attackDamage: 8,
      durability: 40,
      speed: Constant.ENERGY_THRESHOLD * 5,
      faction: 'LOCUST',
      enemyFactions: ['COG'],
      // directional projectile destruction breaks engine
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.directionalKunai(this.game.engine, { ...pos }, direction, range)
      // getProjectile: ({ pos, targetPos, direction, range }) => Item.kunai(game.engine, { ...pos }, { ...targetPos })
    })
    if (this.game.placeActorOnMap(entity)) {
      this.game.engine.addActor(entity);
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
        player.pos = {x: position.x, y: player.pos.y};
        this.game.placeActorOnMap(player)
      }
    })
  }

  playerIsOnExit() {
    const player = this.game.getFirstPlayer();
    if (player) {
      const tile = this.game.map[Helper.coordsToString(player.pos)];
      if (tile.type === 'EXIT') {
        return true;
      }
    }
    return false
  }

  activateExitTiles() {
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: this.game.mapWidth - 3, y: 0 },
      this.game.mapHeight,
      3,
      'EXIT',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

}
