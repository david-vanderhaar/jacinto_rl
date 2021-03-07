import Konva from 'konva';
import uuid from 'uuid/v1';
import * as Helper from '../../helper';

export const ANIMATION_TYPES = {
  DEFAULT: 0,
  BLINK_TILE: 1,
  SOLID_TILE: 2,
}

class Animation {
  constructor({display}) {
    const id = uuid();
    this.id = id;
    this.lifeTime = 0;
    this.active = true;
    this.display = display;
    this.node = null;
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

class BlinkTile extends Animation {
  constructor({
    x,
    y,
    lerpDirection = -1,
    color = '#fff',
    ...args
  }) {
    super({ ...args });
    this.x = x;
    this.y = y;
    this.lerpDirection = lerpDirection;
    this.color = color;
  }

  getActive () {
    return this.active;
  }

  initialize () {
    this.active = true;
    let rect = new Konva.Rect({
      name: 'rect',
      x: (this.display.tileWidth * this.x) + (this.display.tileOffset + this.display.tileGutter),
      y: (this.display.tileHeight * this.y) + (this.display.tileOffset + this.display.tileGutter),
      offsetX: this.display.tileWidth / -4,
      offsetY: this.display.tileHeight / -4,
      width: this.display.tileWidth / 2,
      height: this.display.tileHeight / 2,
      fill: this.color,
      strokeEnabled: false,
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
    });
    this.display.animationLayer.add(rect);
    this.node = rect;
    super.initialize();
  }

  update (frame) {
    let opacity = this.node.opacity();
    if (opacity >= 1) this.lerpDirection = -1;
    if (opacity <= 0) this.lerpDirection = 1;
    opacity += (0.05 * this.lerpDirection)
    this.node.opacity(Helper.clamp(opacity, 0, 1))
    super.update(frame);
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
  }

  initialize (document) {
    let d = document.getElementById(this.containerId)
    let displayContainer = document.createElement('div');
    d.appendChild(displayContainer);

    this.adjustContentToScreen(d);
    
    this.stage = new Konva.Stage({
      container: 'display',   // id of container <div>
      width: this.width,
      height: this.height
    });

    
    // setting up main tile map layer
    this.layer = new Konva.Layer({
      hitGraphEnabled: false,
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

  adjustContentToScreen (display_element) {
    const DEVICE_WIDTH = display_element.offsetWidth;
    const value = (DEVICE_WIDTH - this.tileOffset) / this.game.mapWidth;
    this.tileWidth = Math.ceil(value);
    this.tileHeight = this.tileWidth;
    this.width = ((this.game.mapWidth - 1) * this.tileWidth) + this.tileOffset;
    this.height = (this.game.mapHeight * this.tileHeight) + this.tileOffset;
  }

  addAnimation (type, args) {
    let animation;
    switch (type) {
      case ANIMATION_TYPES.SOLID_TILE:
        animation = new ExampleAnimation({display: this, ...args})
        break;
      case ANIMATION_TYPES.BLINK_TILE:
        animation = new BlinkTile({display: this, ...args})
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
    const actual_x = (this.tileWidth * x) + (this.tileOffset + this.tileGutter);
    const actual_y = (this.tileHeight * y) + (this.tileOffset + this.tileGutter);
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
      listening: false,
      shadowForStrokeEnabled: false,
    });

    let text = new Konva.Text({
      name: 'text',
      text: character,
      width: this.tileWidth,
      height: this.tileHeight,
      fontSize: this.tileWidth - 4,
      fontFamily: 'scroll-o-script',
      fill: foreground,
      align: 'center',
      verticalAlign: 'middle',
      // for optimization
      transformsEnabled: 'position',
      perfectDrawEnabled: false,
      listening: false,
      shadowForStrokeEnabled: false,
    });

    const dis_layer = this.layer;
    if (x === 1 && y === 1) {
      Konva.Image.fromURL('/tile241.png', function (darthNode) {
        darthNode.setAttrs({
          x: actual_x,
          y: actual_y,
          scaleX: 1,
          scaleY: 1,
          fill: 'pink',
          opacity: 0.5
        });
        dis_layer.add(darthNode);
      });
      // var imageObj = new Image();
      // imageObj.onload = function () {
      //   var yoda = new Konva.Image({
      //     x: 50,
      //     y: 50,
      //     image: imageObj,
      //     width: 106,
      //     height: 118,
      //   });

      //   // add the shape to the layer
      //   this.layer.add(yoda);
      //   // layer.batchDraw();
      // };
      // imageObj.src = '/tile241.png';
    }

    node.add(rect);
    node.add(text);
    this.layer.add(node);
    return node;
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

  getTilesAcrossOnScreen () { return Math.floor(this.width / this.tileWidth)}
  getTilesDownOnScreen () { return Math.floor(this.height / this.tileHeight)}

  draw () {
    this.layer.batchDraw();
  }
}