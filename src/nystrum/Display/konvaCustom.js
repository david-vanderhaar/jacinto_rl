import Konva from 'konva';
import uuid from 'uuid/v1';
import * as Helper from '../../helper';
import { Move } from '../Actions/Move';
import { MoveRangedAttackCursor } from '../Actions/MoveRangedAttackCursor';

export const ANIMATION_TYPES = {
  DEFAULT: 0,
  BLINK_TILE: 1,
  SOLID_TILE: 2,
  BLINK_BOX: 3,
  TEXT_FLOAT: 4,
  TEXT_OVERLAY: 5,
}

class Animation {
  constructor({display, game}) {
    const id = uuid();
    this.id = id;
    this.lifeTime = 0;
    this.active = true;
    this.node = null;
    this.display = display;
  }

  getActive () {
    return false;
  }

  initialize () {
    return;
  }

  update (frame) {
    this.lifeTime += frame.timeDiff;
    this.active = this.getActive();
    if (!this.active) {
      this.display.removeAnimation(this.id);
    }
  }
}

class ExampleAnimation extends Animation {
  constructor({...args}) {
    super({...args})
  }

  getActive () {
    if (this.lifeTime > 500) {
      return false;
    }
    return true;
  }
}

class TextFloat extends Animation {
  constructor({
    x,
    y,
    text,
    color = '#fff',
    textAttributes = {},
    ...args
  }) {
    super({ ...args });
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
    this.textAttributes = textAttributes;
  }

  getActive () {
    if (this.lifeTime > 500) {
      return false;
    }
    return true;
  }

  initialize () {
    this.active = true;
    const attrs = {
      name: 'text',
      x: (this.display.tileWidth * (this.x + this.display.game.getRenderOffsetX())) + (this.display.tileOffset + this.display.tileGutter),
      y: (this.display.tileHeight * (this.y + this.display.game.getRenderOffsetY())) + (this.display.tileOffset + this.display.tileGutter),
      text: this.text,
      fontSize: this.display.tileWidth / 2,
      fontFamily: 'player-start-2p, Courier New',
      fill: this.color,
      // strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
      ...this.textAttributes,
    };

    let node = new Konva.Text(attrs);
    this.display.animationLayer.add(node);
    this.node = node;
    super.initialize();
  }

  update (frame) {
    let y = this.node.y();
    y += (1 * -1)
    this.node.y(y)
    super.update(frame);
  }
}

class TextOverlay extends Animation {
  constructor({
    x,
    y,
    text,
    color = '#fff',
    textAttributes = {},
    isBlinking = false,
    ...args
  }) {
    super({ ...args });
    this.x = x;
    this.y = y;
    this.color = color;
    this.text = text;
    this.textAttributes = textAttributes;
    this.isBlinking = isBlinking
    this.lerpDirection = -1
  }

  getActive () {
    return this.active;
  }

  initialize () {
    this.active = true;
    const attrs = {
      name: 'text',
      text: this.text,
      x: (this.display.tileWidth * (this.x + this.display.game.getRenderOffsetX())) + (this.display.tileOffset + this.display.tileGutter),
      y: (this.display.tileHeight * (this.y + this.display.game.getRenderOffsetY())) + (this.display.tileOffset + this.display.tileGutter),
      width: this.display.tileWidth,
      height: this.display.tileHeight,
      fontSize: this.display.tileWidth / 4,
      // offsetX: this.display.tileWidth / -4,
      fontFamily: 'player-start-2p, Courier New',
      verticalAlign: 'middle',
      align: 'center',
      fill: this.color,
      // strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
      ...this.textAttributes,
    };

    let node = new Konva.Text(attrs);
    this.display.animationLayer.add(node);
    this.node = node;
    super.initialize();
  }

  update(frame) {
    // blinking anim code can be abstracted to helper
    if (!this.isBlinking) return
    let opacity = this.node.opacity();
    if (opacity >= 1) this.lerpDirection = -1;
    if (opacity <= 0) this.lerpDirection = 1;
    opacity += (0.030 * this.lerpDirection)
    this.node.opacity(Helper.clamp(opacity, 0, 1))
    super.update(frame);
  }
}

class BlinkTile extends Animation {
  constructor({
    x,
    y,
    lerpDirection = -1,
    color = '#fff',
    rectAttributes = {},
    isBlinking = true,
    ...args
  }) {
    super({ ...args });
    this.x = x;
    this.y = y;
    this.lerpDirection = lerpDirection;
    this.color = color;
    this.rectAttributes = rectAttributes;
    this.isBlinking = isBlinking;
  }

  getActive () {
    return this.active;
  }

  initialize () {
    this.active = true;
    const attrs = {
      name: 'rect',
      x: (this.display.tileWidth * (this.x + this.display.game.getRenderOffsetX())) + (this.display.tileOffset + this.display.tileGutter),
      y: (this.display.tileHeight * (this.y + this.display.game.getRenderOffsetY())) + (this.display.tileOffset + this.display.tileGutter),
      offsetX: this.display.tileWidth / -4,
      offsetY: this.display.tileHeight / -4,
      width: this.display.tileWidth / 2,
      height: this.display.tileHeight / 2,
      fill: this.color,
      // strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
      ...this.rectAttributes,
    };
    let rect = new Konva.Rect(attrs);
    this.display.animationLayer.add(rect);
    this.node = rect;
    super.initialize();
  }

  update (frame) {
    if (!this.isBlinking) return
    let opacity = this.node.opacity();
    if (opacity >= 1) this.lerpDirection = -1;
    if (opacity <= 0) this.lerpDirection = 1;
    opacity += (0.030 * this.lerpDirection)
    this.node.opacity(Helper.clamp(opacity, 0, 1))
    super.update(frame);
  }
  
}

export class BlinkBox extends BlinkTile {
  constructor({...args}) {
    super({ ...args });
    this.rectAttributes = {
      fill: 'transparent',
      stroke: args.color,
      strokeWidth: args.strokeWidth || 5,
      offsetX: 0,
      offsetY: 0,
      width: this.display.tileWidth,
      height: this.display.tileHeight,
    }
  }
}

export class Display {
  constructor({
    containerId = null,
    width = 100,
    height = 100,
    tileWidth = 10,
    tileHeight = 10,
    tileGutter = 0,
    tileOffset = 10,
    game = null,
    mouseEnabled = false
  }) {
    this.containerId = containerId;
    this.width = width;
    this.height = height;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.tileGutter = tileGutter;
    this.tileOffset = tileOffset;
    this.stage = null;
    this.layer = null;
    this.animationLayer = null;
    this.animations = [];
    this.animationLoop = null;
    this.game = game;
    this.animationTypes = ANIMATION_TYPES;
    this.mouseEnabled = mouseEnabled
  }

  initialize (document) {
    let d = document.getElementById(this.containerId)
    let displayContainer = document.createElement('div');
    d.appendChild(displayContainer);

    this.adjustContentToScreen(d);
    
    this.stage = new Konva.Stage({
      container: 'display',   // id of container <div>
      width: this.width,
      height: this.height,
    });

    
    // setting up main tile map layer
    this.layer = new Konva.Layer({
      hitGraphEnabled: this.mouseEnabled,
    });
    
    this.stage.add(this.layer);
    
    // setting up animation layer
    this.animationLayer = new Konva.Layer({});
    this.stage.add(this.animationLayer);
    let animationLoop = new Konva.Animation((frame) => {
      this.animations.forEach((animation) => animation.update(frame))
      // Stop animation updates if no animations to process
      if (this.animations.length <= 0) {
        if (this.animationLoop) {
          if (this.animationLoop.isRunning()) {
            this.animationLoop.stop();
          }
        }
      }
    }, this.animationLayer);
    this.animationLoop = animationLoop;
    animationLoop.start();
  }

  async shakeScreen ({intensity = 1}) {
    this.shakeNode({node: this.stage, intensity})
  }

  async shakeNode ({node, intensity = 1}) {
    if (!!!node) return;
    let duration = 10;
    let shakeCount = 5 * intensity
    while (shakeCount > 0) {
      const randomX = Helper.getRandomIntInclusive(1, 5) * intensity
      const randomY = Helper.getRandomIntInclusive(1, 5) * intensity
      node.offsetX(randomX)
      node.offsetY(randomY)
      node.draw()
      await Helper.delay(duration/shakeCount);
      shakeCount -= 1
    }
    node.offsetX(0)
    node.offsetY(0)
    node.draw()
  }

  adjustContentToScreen (display_element) {
    const DEVICE_HEIGHT = display_element.offsetHeight;
    const value = (DEVICE_HEIGHT - this.tileOffset) / this.game.getRenderHeight();
    const DEVICE_WIDTH = display_element.offsetWidth;
    // const value = (DEVICE_WIDTH - this.tileOffset) / this.game.getRenderWidth();
    this.tileWidth = Math.round(value);
    this.tileHeight = this.tileWidth;

    const adjustedCameraWidth = this.getTilesDownOnScreenByWidth(DEVICE_WIDTH)
    const newRenderWidth = this.game.setRenderWidth(adjustedCameraWidth)
    this.width = (newRenderWidth * this.tileWidth) + this.tileOffset;

    const adjustedCameraHeight = this.getTilesDownOnScreenByHeight(DEVICE_HEIGHT)
    const newRenderHeight = this.game.setRenderHeight(adjustedCameraHeight)
    this.height = (newRenderHeight * this.tileHeight) + this.tileOffset;
  }

  adjustGameCameraHeightToScreenHeight (height) { this.game.cameraHeight = this.getTilesDownOnScreenByHeight(height) }
  adjustGameCameraHeightToScreenHeight (height) { this.game.cameraHeight = this.getTilesDownOnScreenByHeight(height) }

  addAnimation (type, args) {
    let animation;
    switch (type) {
      case ANIMATION_TYPES.SOLID_TILE:
        animation = new ExampleAnimation({display: this, ...args})
        break;
      case ANIMATION_TYPES.BLINK_TILE:
        animation = new BlinkTile({display: this, ...args})
        break;
      case ANIMATION_TYPES.BLINK_BOX:
        animation = new BlinkBox({display: this, ...args})
        break;
      case ANIMATION_TYPES.TEXT_FLOAT:
        animation = new TextFloat({display: this, ...args})
        break;
      case ANIMATION_TYPES.TEXT_OVERLAY:
        animation = new TextOverlay({display: this, ...args})
        break;
      case ANIMATION_TYPES.DEFAULT:
      default:
        animation = new Animation({ display: this, ...args})
        break;
    }
    animation.initialize();
    this.animations.push(animation)
    if (!this.animationLoop.isRunning()) this.animationLoop.start();
    return animation
  }

  removeAnimation (id) {
    this.animations = this.animations.filter((anim) => {
      if (anim.id !== id) return true;
      // if anim is being removed, remove associated nodes and shapes too
      anim.node.destroy();
      return false;
    });
  }

  removeAnimations(ids) {
    ids.forEach((id) => this.removeAnimation(id))
  }

  updateAnimation (id) {
    this.animations = this.animations.map((anim) => {
      if (anim.id === id) {
        console.log(anim);
      }
      return anim;
    });
  }

  updateTile(tile, character, foreground, background) {
    // child[0] is the rectangle
    // child[1] is the text
    if (tile) {
      tile.children[0].fill(background);
      tile.children[1].fill(foreground);
      tile.children[1].text(character);
    }
  }

  createTile(x, y, character, foreground, background, layer = 'layer') {
    // const actual_x = (this.tileWidth * x) + (this.tileOffset + this.tileGutter);
    // const actual_y = (this.tileHeight * y) + (this.tileOffset + this.tileGutter);
    let node = new Konva.Group({
      id: `${x},${y}`,
      x: (this.tileWidth * x) + (this.tileOffset + this.tileGutter),
      y: (this.tileHeight * y) + (this.tileOffset + this.tileGutter),
      width: this.tileWidth,
      height: this.tileHeight,
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
    });

    let rect = new Konva.Rect({
      name: 'rect',
      width: this.tileWidth,
      height: this.tileHeight,
      fill: background,
      strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: this.mouseEnabled,
      shadowForStrokeEnabled: false,
    });

    let text = new Konva.Text({
      name: 'text',
      text: character,
      width: this.tileWidth,
      height: this.tileHeight,
      fontSize: this.tileWidth - 2,
      fontFamily: 'scroll-o-script, Courier New',
      // fontFamily: 'scroll-o-script, player-start-2p',
      fill: foreground,
      align: 'center',
      verticalAlign: 'bottom',
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
    });

    node.add(rect);
    node.add(text);
    if (this.mouseEnabled) this.addMouseListenersToNode(rect, {x, y})

    this.layer.add(node);
    return node;
  }

  addMouseListenersToNode(tileNode, worldPosition) {
    let animations = []
    const display = this
    let color = '#3e7dc9'
    let path = []
    let player = display.game.getFirstPlayer()
    let actionType = null
    let keymapKey = null

    tileNode.on('mouseover', () => {
      const position = display.getRelativeTilePosition(worldPosition)
      const entities = Helper.getEntitiesByPositionByType({
        game: display.game,
        position,
        entityType: 'DESTRUCTABLE'
      })

      if (display.preparedToFire(player)) {
        const playerPos = player.getPosition()
        const action = new MoveRangedAttackCursor({
          targetPos: position,
          availablePositions: Helper.getPointsWithinRadius(playerPos, player.getAttackRange()),
          actor: player,
          game: display.game,
        })

        action.immediatelyExecuteAction()

        player.getKeymap().m(position).immediatelyExecuteAction()
      }

      if (entities.length <= 0 && !display.preparedToFire(player)) {
        color = '#fff'
        const playerPos = player.getPosition()
        path = Helper.calculatePathAroundObstacles(display.game, position, playerPos)
        if (path.length) actionType = Move
        animations.push(...display.highlightPathTiles(path))
      }
      
      if (entities.length > 0) {
        keymapKey = 'f'
      }

      // add tile highlight
      animations.push(display.highlightTile(position, color))
    });

    tileNode.on('click', () => {
      let action = null
      if (actionType) {
        action = new actionType({
          targetPos: path[0],
          game: display.game,
          actor: player,
          energyCost: 100
        });
        actionType = null
      } else if (keymapKey) {
        action = player.getKeymap()[keymapKey]()
        keymapKey = null
      }

      if (!Boolean(action)) return
      action.immediatelyExecuteAction()
      tileNode.fire('mouseout')
      tileNode.fire('mouseover')
    })

    tileNode.on('mouseout', () => {
      // remove tile highlight
      if (animations.length > 0) {
        display.removeAnimations(animations.map((anim) => anim.id))
      }
    });
  }

  preparedToFire(player) {
    const keymapAction = player.getKeymap().f 
    if (!keymapAction) return false
    return keymapAction()?.label === 'Fire'
  }

  highlightTile(position, color) {
    return this.addAnimation(
      ANIMATION_TYPES.BLINK_BOX,
      {
        ...position,
        color,
      },
    )
  }

  highlightPathTiles(path, color) {
    const animations = []
    path.forEach((pos) => {
      animations.push(
        this.addAnimation(
          ANIMATION_TYPES.BLINK_TILE,
          {
            ...pos,
            color,
          },
        )
      )
    })

    return animations
  }

  getRelativeTilePosition(position) {
    return {
      x: position.x - this.game.getRenderOffsetX(),
      y: position.y - this.game.getRenderOffsetY()
    }
  }

  getAbsoultueX(x) {
    return (this.tileWidth * x) + (this.tileOffset + this.tileGutter)
  }

  getAbsoultueY(y) {
    return (this.tileWidth * y) + (this.tileOffset + this.tileGutter)
  }

  getTilesWide (width, tileOffset, tileWidth) {
    return Math.floor((width - tileOffset) / tileWidth)
  }
  
  getTilesHigh(height, tileOffset, tileHeight) {
    return Math.floor((height - tileOffset) / tileHeight)
  }

  getTilesDownOnScreenByWidth (canvasWidth) { return Math.ceil(canvasWidth / this.tileWidth)}
  getTilesDownOnScreenByHeight (canvasHeight) { return Math.ceil(canvasHeight / this.tileHeight)}

  draw () {
    this.layer.batchDraw();
  }
}
