import pipe from 'lodash/fp/pipe';
import { Entity } from './Entity';
import { Parent } from './Parent';
import { PresentingUI } from './PresentingUI';
import { HasInnerGates } from './HasInnerGates';
import { UI } from './UI';
import {HasTargetingCursor} from './HasTargetingCursor';
import { Attacking } from './Attacking';
import { Equipable } from './Equipable';
import { Acting } from './Acting';
import { Rendering } from './Rendering';
import { Containing } from './Containing';
import { Equiping } from './Equiping';
import { Charging } from './Charging';
import { Signing } from './Signing';
import { Playing } from './Playing';
import { Cloning } from './Cloning';
import { DestructiveProjecting } from './DestructiveProjecting';
import { DirectionalProjecting } from './DirectionalProjecting';
import { DirectionalPushing } from './DirectionalPushing';
import { GaseousDestructiveProjecting } from './GaseousDestructiveProjecting';
import { Gaseous } from './Gaseous';
import { Chasing } from './Chasing';
import { RangedChasing } from './RangedChasing';
import { Dragging } from './Dragging';
import { Draggable } from './Draggable';
import { Pushable } from './Pushable';
import { Spreading } from './Spreading';
import { Destructable } from './Destructable';
import { IsParticle } from './IsParticle';
import { Speaking } from './Speaking';
import { Burnable } from './Burnable';
import { Exploding } from './Exploding';
import { Helpless } from './Helpless';
import { HasKeymap } from './HasKeymap';

export const UI_Actor = pipe(
  Acting,
  Rendering,
  Playing,
  HasKeymap,
  UI
)(Entity);

export const Actor = pipe(
  Acting,
  Rendering
)(Entity);

export const Speaker = pipe(
  Acting,
  Rendering,
  Destructable,
  Speaking,
  Draggable,
  Pushable,
  Burnable,
  Helpless,
)(Entity);

export const Wall = pipe(
  Rendering,
  Destructable,
)(Entity);

export const Debris = pipe(
  Rendering,
  Containing,
  Draggable,
  Burnable,
  Destructable,
  Exploding,
  Pushable,
)(Entity);

export const MovingWall = pipe(
  Acting,
  Rendering,
  // Pushing,
  DirectionalPushing,
  Destructable,
)(Entity);

export const Chaser = pipe(
  Acting,
  Rendering,
  Chasing,
  Destructable
)(Entity);

export const Bandit = pipe(
  Acting,
  Rendering,
  Chasing,
  Destructable,
  Attacking,
  Pushable,
)(Entity);

export const RangedBandit = pipe(
  Acting,
  Rendering,
  RangedChasing,
  Destructable,
  Attacking,
  Pushable,
)(Entity);

export const Player = pipe(
  Acting,
  Rendering,
  PresentingUI,
  HasTargetingCursor,
  HasKeymap,
  Dragging,
  Charging,
  Signing,
  Containing,
  Equiping,
  Attacking,
  HasInnerGates,
  Destructable,
  Cloning,
  Playing,
  Burnable,
)(Entity);

export const Weapon = pipe(
  Rendering,
  Equipable,
  Attacking
)(Entity);

export const Armor = pipe(
  Rendering,
  Equipable,
  Destructable,
)(Entity);

export const DestructiveProjectile = pipe(
  Acting,
  Rendering,
  Attacking,
  DestructiveProjecting,
  Destructable
)(Entity);

export const DirectionalProjectile = pipe(
  Acting,
  Rendering,
  Attacking,
  DirectionalProjecting,
  Destructable,
)(Entity);

export const DestructiveCloudProjectile = pipe(
  Acting,
  Rendering,
  Attacking,
  GaseousDestructiveProjecting,
  Destructable,
  Gaseous
)(Entity);

export const DestructiveCloudProjectileV2 = pipe(
  Acting,
  Destructable,
  Parent,
)(Entity);

export const FireSpread = pipe(
  Acting,
  Rendering,
  Destructable,
  Attacking,
  Spreading,
)(Entity);

export const Particle = pipe(
  Acting,
  Rendering,
  IsParticle,
)(Entity);

export const ParticleEmitter = pipe(
  Acting,
  Destructable,
  Parent,
)(Entity);