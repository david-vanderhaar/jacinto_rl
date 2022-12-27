import * as Constant from '../../constants';
import * as Helper from '../../../helper';
import * as Item from '../../items';
import * as MapHelper from '../../Maps/helper';
import { generate as generateBuilding } from '../../Maps/generator';
import * as CoverGenerator from '../../Maps/coverGenerator';
import { EmergenceHole } from '../../Entities/index';
import { Mode } from '../default';
import SOUNDS from '../../sounds';
import {JACINTO_SOUNDS} from '../../Modes/Jacinto/sounds';
import * as _ from 'lodash';
import {COLORS, TILE_KEY} from './theme';
import { Ammo } from '../../Items/Pickups/Ammo';
import { Grenade } from '../../Items/Weapons/Grenade';
import * as LocustActors from './Actors/Grubs';
import { CogTag } from '../../Items/Pickups/CogTag';
const MAP_DATA = require('./Maps/map_01.json');
// const MAP_DATA = require('../../Maps/castle.json');

export class Jacinto extends Mode {
  constructor({ ...args }) {
    super({ ...args });
    // this.game.fovActive = true
    this.data = {
      level: 1,
      highestLevel: null,
      turnCount: 0,
    };
    this.dataByLevel = [
      {
        enemies: [
          ...Array(6).fill('Wretch'),
          // ...Array(1).fill('Hunter'),
          // ...Array(2).fill('Scion'),
          // ...Array(2).fill('DroneGrenadier'),
          // ...Array(1).fill('Drone'),
        ],
        emergenceHoles: 0,
      },
      {
        enemies: [
          ...Array(1).fill('Scion'),
          ...Array(6).fill('Wretch'),
        ],
        emergenceHoles: 0,
      },
      {
        enemies: [
          ...Array(4).fill('Drone'),
        ],
        emergenceHoles: 0,
      },
      {
        enemies: [
          ...Array(3).fill('Wretch'),
        ],
        emergenceHoles: 1,
      },
      {
        enemies: [],
        emergenceHoles: 6,
      },
      {
        enemies: [
          ...Array(4).fill('Hunter'),
        ],
        emergenceHoles: 0,
      },
      {
        // enemies: [...Array(4).fill('RandomGrub'), 'Skorge'],
        enemies: [...Array(12).fill('Wretch'), 'Skorge'],
        emergenceHoles: 3,
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

  createCityBlockLevel () {
    const numberOfVerticalRoads = Helper.getRandomIntInclusive(0, 2);
    const numberOfBuildings = Helper.getRandomIntInclusive(1, 5);

    this.game.createEmptyLevel();
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

    // adding cover blocks
    const numberOfCoverStructures = Helper.getRandomIntInclusive(2, 10);
    
    let coverEligibleTiles = Object.keys(this.game.map).filter((key) =>  ['ROAD', 'DOOR', 'EMERGENCE_GROUND'].includes(this.game.map[key].type))
    for (let index = 0; index < numberOfCoverStructures; index++) {
      let pos = Helper.getRandomInArray(coverEligibleTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      const position = { x: posXY[0], y: posXY[1] };
      CoverGenerator.generateRandom(position, this.game);
    }

  }

  initialize () {
    super.initialize();
    this.game.tileKey = TILE_KEY
    this.setWaveData();
    
    // this.game.createCustomLevel(MAP_DATA);
    this.createCityBlockLevel();
    this.game.initializeMapTiles();

    let floorTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'FLOOR')
    const safeTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type == 'SAFE');
    this.placeCogInSafeZone(safeTiles);
    const player = this.game.getFirstPlayer();
    if (player) {
      player.upgrade_points += 1;
      player.restoreFullEnergy()
    }

    // cover tiles
    let coverEligibleTiles = Object.keys(this.game.map).filter((key) => this.game.map[key].type === 'COVER_PLACEHOLDER')
    coverEligibleTiles.forEach((key) => {
      let pos = key.split(',').map((coord) => parseInt(coord));
      const position = { x: pos[0], y: pos[1] };
      CoverGenerator.generateSingle(position, this.game);
    })

    // adding emergence holes
    for (let index = 0; index < this.data.emergenceHoles; index++) {
      let pos = Helper.getRandomInArray(this.getEmptyTileKeys());
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addEmerenceHole({ x: posXY[0], y: posXY[1] });
    }

    // adding  cog tags loot
    const cogTagLoot = Helper.getRandomInArray([0, 0, 0, 1])
    for (let index = 0; index < cogTagLoot; index++) {
      let pos = Helper.getRandomInArray(floorTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addCogTagLoot({ x: posXY[0], y: posXY[1] });
    }

      // adding enemies
    this.data.enemies.forEach((enemyName) => {
      let pos = Helper.getRandomInArray(this.getEmptyGroundTileKeys());
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      LocustActors[`add${enemyName}`](this, { x: posXY[0], y: posXY[1] });
    })

    // adding  ammo loot
    const totalEnemyHealth = this.enemies().reduce((prev, curr) => prev + curr.durability, 0)
    const weaponDamage = 2
    const difficultyModifier = 0.5
    const ammoLoot = Math.round((totalEnemyHealth / weaponDamage) * (1 - difficultyModifier))
    const ammoPos = Helper.getRandomInArray(floorTiles);
    if (ammoPos) {
      const posXY = ammoPos.split(',').map((coord) => parseInt(coord));
      this.addAmmoLoot({ x: posXY[0], y: posXY[1] }, ammoLoot);
    }

    // adding  grenade loot
    const grenadeLoot = Math.random() > 0.9 ? 1 : 0
    for (let index = 0; index < grenadeLoot; index++) {
      let pos = Helper.getRandomInArray(floorTiles);
      if (!pos) break;
      let posXY = pos.split(',').map((coord) => parseInt(coord));
      this.addGrenadeLoot({ x: posXY[0], y: posXY[1] });
    }
    // super.initialize();
    this.game.draw()
    JACINTO_SOUNDS.level_start.play()
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
    this.data = {...this.data, ...nextLevelData, hasPlayedEndSound: false}
  }

  levelComplete () {
    const playerOnExit = this.playerIsOnExit();
    const enemiesDefeated = this.enemiesDefeated();
    if (enemiesDefeated) {
      this.activateExitTiles();
      if (!this.data.hasPlayedEndSound) {
        JACINTO_SOUNDS.level_end.play()
        this.data.hasPlayedEndSound = true
      }
    }

    return playerOnExit && enemiesDefeated
  }

  enemiesDefeated () {
    return this.enemies().length <= 0
  }

  enemies () {
    return this.game.engine.actors.filter((actor) => actor['faction'] === 'LOCUST')
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
        character: '+',
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
      getSpawnedEntity: (spawnPosition) => LocustActors.createRandomBasicGrub(this, spawnPosition),
      onDestroy: () => {
        this.game.map[Helper.coordsToString(pos)].type = 'EMERGENCE_DESTROYED'
        JACINTO_SOUNDS.emergence_01.play()
      },
      onSpawn: () => {
        console.log('onSpawn');
        JACINTO_SOUNDS.emergence_02.play()
      }
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

  addAmmoLoot (pos, count = 1) {
    this.createAmmoStack(count, pos).forEach((entity) => {
      this.game.placeActorOnMap(entity)
    })
  }

  addGrenadeLoot (pos) {
    const entity = Grenade(this.game.engine, 6);
    entity.pos = pos;
    this.game.placeActorOnMap(entity)
  }

  addCogTagLoot (pos) {
    const entity = CogTag();
    entity.pos = pos;
    this.game.placeActorOnMap(entity)
  }

  placePlayersInSafeZone (safeZoneTileKeys) {
    let players = this.getPlayers()
    players.forEach((player) => {
      const key = safeZoneTileKeys.shift();
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

  placeCogInSafeZone (safeZoneTileKeys) {
    let cogEntities = this.getCogEntites()
    cogEntities.forEach((cog) => {
      const key = safeZoneTileKeys.shift();
      if (key) {
        const position = {
          x: parseInt(key.split(',')[0]),
          y: parseInt(key.split(',')[1]),
        }
        cog.pos = {x: position.x, y: position.y};
        this.game.placeActorOnMap(cog)
      }
    })
  }

  getCogEntites () {
    const entitiesWithFaction = this.game.engine.actors.filter((actor) => actor.entityTypes.includes('HAS_FACTION'))
    return entitiesWithFaction.filter((entity) => entity.faction === 'COG');
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
    const mainRoadY = this.game.mapHeight / 4
    MapHelper.addTileZone(
      this.game.tileKey,
      { x: this.game.mapWidth - 3, y: mainRoadY },
      4,
      3,
      'EXIT',
      this.game.map,
      this.game.mapHeight,
      this.game.mapWidth,
    );
  }

}
