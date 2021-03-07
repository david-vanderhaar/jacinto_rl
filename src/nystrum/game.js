import React from 'react';
import * as ROT from 'rot-js';
import * as Constant from './constants';
import * as Helper from '../helper';
import * as Message from './message';
import { Display } from './Display/konvaCustom';
import Mode from './Modes/index';
import * as _ from 'lodash';

// const MAP_DATA = require('./Maps/castle.json');
// const SOLANGE = require('./Data/solange.json');

const MAP_WIDTH = 60;
const MAP_HEIGHT = 25;

const TILE_OFFSET = 0;

const TILE_WIDTH = 30;
const TILE_HEIGHT = TILE_WIDTH;

const canvasWidth = (MAP_WIDTH * TILE_WIDTH) + TILE_OFFSET;
const canvasHeight = (MAP_HEIGHT * TILE_HEIGHT) + TILE_OFFSET;

export class Game {
  constructor({
    engine = null,
    map = {},
    entityMap = {},
    entityDictionary = {},
    mapInitialized = false,
    tileMap = {},
    mapWidth = MAP_WIDTH,
    mapHeight = MAP_HEIGHT,
    cameraWidth = MAP_WIDTH,
    cameraHeight = MAP_HEIGHT,
    tileWidth = TILE_WIDTH,
    tileHeight = TILE_HEIGHT,
    tileOffset = TILE_OFFSET,
    getSelectedCharacter = () => false,
    spriteMode = true,
    tileKey = Constant.TILE_KEY,
    mode = Mode.Flume,
    messages = [],
  }) {
    this.engine = engine;
    this.map = map;
    this.entityMap = entityMap;
    this.entityDictionary = entityDictionary;
    this.mapInitialized = mapInitialized;
    this.tileMap = tileMap;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.cameraWidth = cameraWidth;
    this.cameraHeight = cameraHeight;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileOffset = tileOffset;
    this.display = new Display({
      containerId: 'display',
      width: canvasWidth,
      height: canvasHeight,
      tileWidth: tileWidth,
      tileHeight: tileHeight,
      tileOffset: tileOffset,
      game: this,
    });
    this.spriteMode = spriteMode;
    this.tileKey = tileKey;
    this.mode = new mode({game: this});
    this.messages = messages;
    this.getSelectedCharacter = getSelectedCharacter;
  }

  initializeMode () {
    this.mode.initialize();
  }
  
  updateMode () { // this is run every game turn
    this.mode.update();
  }

  randomlyPlaceActorOnMap(actor) {
    let kill = 0;
    let placed = false;
    while (!placed) {
      let pos = Helper.getRandomPos(this.map).coordinates
      if (this.canOccupyPosition(pos, actor)) {
        let tile = this.map[Helper.coordsToString(pos)]
        actor.pos = { ...pos }
        tile.entities.push(actor);
        placed = true;
      }
      kill += 1;
      if (kill >= 100) {
        placed = true;
      }
    }
    return placed;
  }

  randomlyPlaceAllActorsOnMap() {
    this.engine.actors.forEach((actor) => {
      this.randomlyPlaceActorOnMap(actor);
    })
  }

  placeActorsOnMap() {
    this.engine.actors.forEach((actor) => {
      let tile = this.map[Helper.coordsToString(actor.pos)]
      if (tile) {
        tile.entities.push(actor);
      } else {
        console.log(`could not place ${actor.id}: ${actor.name} on map`);
      }
    })
  }

  placeActorOnMap(actor) {
    let tile = this.map[Helper.coordsToString(actor.pos)]
    if (tile) {
      tile.entities.push(actor);
      return true
    } else {
      console.log(`could not place ${actor.id}: ${actor.name} on map`);
      return false
    }
  }

  removeActorFromMap (actor) {
    let tile = this.map[Helper.coordsToString(actor.pos)]
    if (!tile) return false;
    this.map[Helper.coordsToString(actor.pos)].entities = tile.entities.filter((ac) => ac.id !== actor.id);
    return true;
  }

  createLevel () {
    let digger = new ROT.Map.Arena(this.mapWidth, this.mapHeight);
    // let digger = new ROT.Map.Rogue();
    // let digger = new ROT.Map.DividedMaze();
    // let digger = new ROT.Map.EllerMaze();
    // let digger = new ROT.Map.Cellular();
    // let digger = new ROT.Map.Digger(this.mapWidth, this.mapHeight);
    // let digger = new ROT.Map.IceyMaze();
    // let digger = new ROT.Map.Uniform();
    let freeCells = [];
    let digCallback = function (x, y, value) {      
      let key = x + "," + y;
      let type = 'GROUND';
      let currentFrame = 0;
      if (value) { 
        type = 'WALL';
        // type = 'WATER';
      }

      if (Constant.TILE_KEY[type].animation) {
        currentFrame = Helper.getRandomInt(0, Constant.TILE_KEY[type].animation.length)
      }

      this.map[key] = {
        type,
        currentFrame,
        entities: [],
      };
      freeCells.push(key);
    }
    digger.create(digCallback.bind(this));
    this.randomlyPlaceAllActorsOnMap()
  }

  createEmptyLevel () {
    for (let i = 0; i < this.mapHeight; i ++) {
      for (let j = 0; j < this.mapWidth; j ++) {
        const key = `${j},${i}`
        let type = 'GROUND';
        let currentFrame = 0;

        if (Constant.TILE_KEY[type].animation) {
          currentFrame = Helper.getRandomInt(0, Constant.TILE_KEY[type].animation.length)
        }

        this.map[key] = {
          type,
          currentFrame,
          entities: [],
        };
      }
    }
  }

  createCustomLevel (data) {
    Object.keys(data.tiles).forEach((key, i) => {
      const tile = data.tiles[key];
      let type = tile.data.type;
      let currentFrame = 0;
      if (!type) {
        type = 'GROUND';
      }

      if (Constant.TILE_KEY[type].animation) {
        currentFrame = Helper.getRandomInt(0, Constant.TILE_KEY[type].animation.length)
      }

    
      this.map[key] = {
        type,
        currentFrame,
        entities: [],
      };
    })

    // this.placeInitialEntities();
  }

  canOccupyPosition (pos, entity = {passable: false}) {
    let result = false;
    let targetTile = this.map[Helper.coordsToString(pos)];
    if (targetTile) {
      let hasImpassableEntity = targetTile.entities.filter((entity) => !entity.passable).length > 0;
      if (!hasImpassableEntity || entity.passable) {
        let tile = this.map[Helper.coordsToString(pos)];
        if (this.tileKey[tile.type].passable) {
          result = true;
        }
      }
    }

    return result;
  }

  cursorCanOccupyPosition(pos) {
    let result = false;
    let targetTile = this.map[Helper.coordsToString(pos)];
    if (targetTile) {
      result = true;
    }

    return result;
  }

  show (document) {
    this.display.initialize(document)
  }

  getRenderMap(fullMap, referencePosition, renderWidth, renderHeight, fullWidth, fullHeight) { 
    // create an object with only tile keys that should be rendered (around player)
    // renderWidth/Height measured in tiles
    // reference positon usually based on player pos
    // position from fullMap key should be translated to 0,0 based on referencePos
    
    const renderPaddingX = Math.floor((renderWidth / 2));
    const renderPaddingY = Math.floor((renderHeight / 2));
    let offsetX = 0;
    let offsetY = 0;
    if (referencePosition) {
      offsetX = referencePosition.x - renderPaddingX;
      offsetY = referencePosition.y - renderPaddingY;
    }
    offsetX = Helper.clamp(offsetX, 0, fullWidth - renderWidth);
    offsetY = Helper.clamp(offsetY, 0, fullHeight - renderHeight);
    
    let result = {}
    for (let key in fullMap) {
      let parts = key.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);
      let finalX = x - offsetX;
      let finalY = y - offsetY;
      if (finalX >= 0 && finalX <= renderWidth) {
        if (finalY >= 0 && finalY <= renderHeight) {
          result[`${finalX},${finalY}`] = fullMap[key]
        }
      }
    }
    return result
  }

  processTileMap (callback) {
    // const map = this.map;
    // const map = this.getRenderMap(this.map, this.getPlayerPosition(), this.mapWidth, this.mapHeight);
    // const map = this.getRenderMap(this.map, this.getPlayerPosition(), 50, 25, this.mapWidth, this.mapHeight);
    const map = this.getRenderMap(this.map, this.getPlayerPosition(), this.cameraWidth, this.cameraHeight, this.mapWidth, this.mapHeight);
    for (let key in map) {
      let parts = key.split(",");
      let x = parseInt(parts[0]);
      let y = parseInt(parts[1]);
      let tile = map[key];
      // let { foreground, background } = this.tileKey[tile.type]
      // Proto code to handle tile animations
      let tileRenderer = this.tileKey[tile.type]
      let nextFrame = this.animateTile(tile, tileRenderer);
      let character = nextFrame.character;
      let foreground = nextFrame.foreground;
      let background = nextFrame.background;
      
      const renderedEntities = tile.entities.filter((entity) => entity.entityTypes.includes('RENDERING'))
      if (renderedEntities.length > 0) {
        let entity = renderedEntities[renderedEntities.length - 1]
        nextFrame = this.animateEntity(entity);

        character = nextFrame.character
        foreground = nextFrame.foreground
        if (nextFrame.background) {
          background = nextFrame.background
        }
      }
      callback(key, x, y, character, foreground, background);          
    }
  }

  initializeMapTiles () {
    if (this.mapInitialized) return false;
    this.mapInitialized = true;
    this.processTileMap((key, x, y, character, foreground, background) => {
      let node = this.display.createTile(x, y, character, foreground, background);
      this.tileMap[key] = node;
    });
  }

  getPlayers () {
    return this.engine.actors.filter((actor) => actor.entityTypes.includes('PLAYING'))
  }

  getPlayerPosition () {
    const players = this.getPlayers();
    if (players.length) return players[0].pos
    return null
  }
  
  draw () {
    this.processTileMap((key, x, y, character, foreground, background) => {
      this.display.updateTile(this.tileMap[key], character, foreground, background);
    });
    this.display.draw();
  }

  getEntityRenderer (renderer) {
    // if sprite mode is on and the renderer has a sprite defined, use that
    if (this.spriteMode && renderer.hasOwnProperty('sprite')) {
      return {...renderer, character: renderer.sprite, foreground: renderer.color}
      // return {character: renderer.sprite, foreground: renderer.background, background: ''}
    }
    // else us the ascii character
    return {...renderer, foreground: renderer.color}
  }

  getTileRenderer (renderer) {
    // if sprite mode is on and the renderer has a sprite defined, use that
    if (this.spriteMode && renderer.hasOwnProperty('sprite')) {
      return {...renderer, character: renderer.sprite}
    }
    // else us the ascii character
    return renderer
  }
  
  animateEntity (entity) {
    let renderer = entity.getRenderer();
    let { character, foreground, background } = this.getEntityRenderer(renderer)
    if (renderer.animation) {
      let frame = this.getEntityRenderer(renderer.animation[entity.currentFrame]);
      character = frame.character;
      foreground = frame.foreground;
      background = frame.background;
      entity.currentFrame = (entity.currentFrame + 1) % renderer.animation.length;
    }
    return {character, foreground, background}
  }

  animateTile (tile, renderer) {
    let {character, foreground, background} = this.getTileRenderer(renderer)
    if (renderer.animation) {
      let frame = this.getTileRenderer(renderer.animation[tile.currentFrame]);
      character = frame.character
      foreground = frame.foreground;
      background = frame.background;
      tile.currentFrame = (tile.currentFrame + 1) % renderer.animation.length;
    }
    return {character, foreground, background}
  }

  addActor (actor, engine = this.engine) {
    let isPlaced = this.placeActorOnMap(actor); // replace with placeActorOnMap
    if (!isPlaced) { return false }
    engine.actors.push(actor);
    this.draw();
    return true
  }

  placeAndDrawActor (actor) {
    this.placeActorsOnMap(); // replace with placeActorOnMap
    this.draw();
  }

  removeActor (actor) {
    this.engine.actors = this.engine.actors.filter((ac) => ac.id !== actor.id);
    // this.engine.currentActor = this.engine.actors.length - 1; // should remove need for this line
    // this.engine.currentActor = (this.engine.currentActor) % this.engine.actors.length;
    // this.engine.currentActor = (this.engine.currentActor + 1) % this.engine.actors.length;
    this.removeActorFromMap(actor);
    this.draw();
  }

  initializeUI (presserRef, document) {
    this.show(document);
    presserRef.current.focus();
  }

  initializeGameData () {
    this.engine.game = this;
    const selectedCharacter = this.getSelectedCharacter();
    this.engine.actors = [selectedCharacter];
    this.engine.actors.forEach((actor) => {
      actor.game = this;
    });
    // this.createEmptyLevel();
    // this.initializeMapTiles();
    this.initializeMode();
    this.draw();
  }

  initialize (presserRef, document) {
    this.initializeUI(presserRef, document);
    this.initializeGameData();
    // hack to register sprite mode
    setTimeout(() => {
      this.spriteMode = false;
      this.draw()
    }, 100)
    setTimeout(() => {
      this.spriteMode = true;
      this.draw()
    }, 100)
    // end hack
  }

  addMessage (text, type) {
    const message = new Message.Message({text, type})
    this.messages.push(message);
  }
}


/************************** UI ********************************/
export const handleKeyPress = (event, engine) => {
  if (!engine.isRunning) {
    let actor = engine.actors[engine.currentActor];
    let keymap = null;
    try {
      keymap = actor.getKeymap();
    } catch (e) {
      console.log('keypress error');
      console.log(e);
    }
    if (keymap) {
      let code = event.key;
      console.log(code);
      if (!(code in keymap)) { return; }
      const getAction = keymap[code];
      const action = getAction();
      // const action = keymap[code];
      action.setAsNextAction();
      engine.start()
    }
  }
  return;
}

export const DisplayElement = (presserRef, handleKeyPress, engine) => {
  return (
    <div
      id='display'
      ref={presserRef}
      onKeyDown={(event) => handleKeyPress(event, engine)}
      // onKeyUp={(event) => handleKeyPress(event, engine)}
      tabIndex='0'
    />
  )
}
/************************** UI ********************************/
