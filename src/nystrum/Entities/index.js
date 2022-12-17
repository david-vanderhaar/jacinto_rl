import pipe from 'lodash/fp/pipe';
import { Entity } from './Entity';
import { Parent } from './Parent';
import { PresentingUI } from './PresentingUI';
import { HasInnerGates } from './HasInnerGates';
import { UI } from './UI';
import {HasTargetingCursor} from './HasTargetingCursor';
import {HasShapePattern} from './HasShapePattern';
import { Attacking } from './Attacking';
import { RangedAttacking } from './RangedAttacking';
import { Equipable } from './Equipable';
import { Acting } from './Acting';
import { Rendering } from './Rendering';
import { Containing } from './Containing';
import { Equiping } from './Equiping';
import { Charging } from './Charging';
import { Signing } from './Signing';
import { Playing } from './Playing';
import { Cloning } from './Cloning';
import { Covering } from './Covering';
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
import { Spawning } from './Spawning';
import { Destructable } from './Destructable';
import { IsParticle } from './IsParticle';
import { Speaking } from './Speaking';
import { Burnable } from './Burnable';
import { Exploding } from './Exploding';
import { Helpless } from './Helpless';
import { HasKeymap } from './HasKeymap';
import { Upgradable } from './Upgradable';
import { HasFaction } from './HasFaction';
import { UsesCover } from './UsesCover';
import { CanActivateStatusEffects } from './CanActivateStatusEffects';
import { CyclesBehaviors } from './AI/CyclesBehaviors';
import { SpawningWithStructure } from './SpawningWithStructure';
import { Projecting } from './Projecting';
import { TimeBombing } from './TimeBombing';
import { HasPickupEffects } from './HasPickupEffects';

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

export const Rendered = pipe(
  Rendering,
)(Entity);

export const RenderedWithPickUpEffects = pipe(
  Rendering,
  HasPickupEffects,
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

export const Trap = pipe(
  Rendering,
  Destructable,
  HasFaction,
)(Entity);

export const CoverWall = pipe(
  Rendering,
  Covering,
  Destructable,
)(Entity);

export const SmokeParticle = pipe(
  Rendering,
  Covering,
  Destructable,
  TimeBombing,
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

export const JacintoAI = pipe(
  Acting,
  Rendering,
  Destructable,
  Attacking,
  Pushable,
  Equiping,
  Containing,
  RangedAttacking,
  HasFaction,
  UsesCover,
  HasTargetingCursor,
  CyclesBehaviors,
)(Entity);

export const Bandit = pipe(
  Acting,
  Rendering,
  Chasing,
  Destructable,
  Attacking,
  Pushable,
  HasFaction,
  UsesCover,
)(Entity);

export const RangedBandit = pipe(
  Acting,
  Rendering,
  RangedChasing,
  Destructable,
  Attacking,
  Pushable,
  HasFaction,
  UsesCover,
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
  RangedAttacking,
  Destructable,
  Cloning,
  Playing,
  Burnable,
  Upgradable,
  HasFaction,
  CanActivateStatusEffects,
  UsesCover,
)(Entity);

export const Weapon = pipe(
  Rendering,
  Equipable,
  Attacking
)(Entity);

export const RangedWeapon = pipe(
  Rendering,
  Equipable,
  RangedAttacking,
  Attacking,
  HasShapePattern,
)(Entity);

export const Armor = pipe(
  Rendering,
  Equipable,
  Destructable,
)(Entity);

export const Ammo = pipe(
  Rendering,
  Destructable,
  Exploding,
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

export const Grenade = pipe(
  Acting,
  Rendering,
  Attacking,
  DirectionalProjecting,
  Destructable,
  Exploding,
)(Entity);

export const ThrowableSpawner = pipe(
  Acting,
  Rendering,
  Attacking,
  DirectionalProjecting,
  Destructable,
  SpawningWithStructure,
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

export const EmergenceHole = pipe(
  Acting,
  Rendering,
  Destructable,
  Spawning,
  HasFaction,
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