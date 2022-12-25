import { Howl } from 'howler';

const createSoundFromSource = (relativePath, howlerOptions = {}) => {
  return new Howl({
    src: [window.PUBLIC_URL + relativePath],
    volume: 0.3,
    loop: false,
    ...howlerOptions,
  })
}

export const JACINTO_SOUND_MANAGER = {
  setVolume: (volume) => {
    Object.entries(JACINTO_SOUNDS).forEach(([key, sound]) => {
      sound.volume(volume)
    })
  }
}

export const JACINTO_SOUNDS = {
  emergence_01: createSoundFromSource('/sounds/jacinto/EarthDebrisSmallClose01.ogg'),
  emergence_02: createSoundFromSource('/sounds/jacinto/EarthDebrisSmallClose02.ogg'),
  cog_tags: createSoundFromSource('/sounds/jacinto/CogTags.ogg'),
  wretch_melee_01: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall01.ogg'),
  wretch_melee_02: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall03.ogg'),
  wretch_melee_03: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall04.ogg'),
  scion_melee_01: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall01.ogg', {rate: 0.5}),
  scion_melee_02: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall03.ogg', {rate: 0.5}),
  scion_melee_03: createSoundFromSource('/sounds/jacinto/actors/wretch/AAttackSmall04.ogg', {rate: 0.5}),
  locust_buff_01: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack01.ogg'),
  locust_buff_02: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack02.ogg'),
  locust_buff_03: createSoundFromSource('/sounds/jacinto/actors/drone/AChatterAttack03.ogg'),
  reload: createSoundFromSource('/sounds/jacinto/weapons/reloadassault02.ogg'),
  needs_reload: createSoundFromSource('/sounds/jacinto/NeedsReload01.ogg'),
  level_start: createSoundFromSource('/sounds/jacinto/ObjectiveAdd01.ogg'),
  level_end: createSoundFromSource('/sounds/jacinto/ObjectiveComplete01.ogg'),
  cog_rifle_fire_01: createSoundFromSource('/sounds/jacinto/weapons/Assault_Fire_02.ogg'),
  cog_rifle_fire_02: createSoundFromSource('/sounds/jacinto/weapons/Assault_Fire_07.ogg'),
  cog_rifle_fire_03: createSoundFromSource('/sounds/jacinto/weapons/CogARifleFire02.ogg'),
  cog_rifle_fire_04: createSoundFromSource('/sounds/jacinto/weapons/CogARifleFire04.ogg'),
  shot_missed_01: createSoundFromSource('/sounds/jacinto/weapons/BBulletImpact10.ogg'),
  shot_missed_02: createSoundFromSource('/sounds/jacinto/weapons/BBulletImpact1.ogg'),
  longshot_fire_01: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire01.ogg'),
  longshot_fire_02: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire02.ogg'),
  longshot_fire_03: createSoundFromSource('/sounds/jacinto/weapons/CogSniperFire03.ogg'),
  pistol_fire_01: createSoundFromSource('/sounds/jacinto/weapons/CogPistolFire01.ogg'),
  pistol_fire_02: createSoundFromSource('/sounds/jacinto/weapons/CogPistolFire02.ogg'),
  chainsaw_01: createSoundFromSource('/sounds/jacinto/weapons/ChainsawRevIdle01.ogg'),
  chainsaw_02: createSoundFromSource('/sounds/jacinto/weapons/ChainsawStart01.ogg'),
  grenade_ready: createSoundFromSource('/sounds/jacinto/weapons/GrenadeBeep02.ogg'),
  smoke_grenade_fire: createSoundFromSource('/sounds/jacinto/weapons/GrenadeSmokeSpew01.ogg'),
  boltok_fire_01: createSoundFromSource('/sounds/jacinto/weapons/LocustBoltok01.ogg'),
  boltok_fire_02: createSoundFromSource('/sounds/jacinto/weapons/LocustBoltok04.ogg'),
  hammerburst_fire_01: createSoundFromSource('/sounds/jacinto/weapons/LocustRifleFire01.ogg'),
  hammerburst_fire_02: createSoundFromSource('/sounds/jacinto/weapons/LocustRifleFire03.ogg'),
  bullet_hit_01: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh01.ogg'),
  bullet_hit_02: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh02.ogg'),
  bullet_hit_03: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactBodyFlesh03.ogg'),
  bullet_miss_01: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt01.ogg'),
  bullet_miss_02: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt02.ogg'),
  bullet_miss_03: createSoundFromSource('/sounds/jacinto/weapons/RifleAmmoImpactDirt03.ogg'),
  explosion_01: createSoundFromSource('/sounds/jacinto/weapons/BoomerExplosionA01.ogg'),
  explosion_02: createSoundFromSource('/sounds/jacinto/weapons/BoomerExplosionB01.ogg'),
}