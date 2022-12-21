import React from 'react';
import * as _ from 'lodash';
import Tooltip from '../Tooltip';
import ActionBar from '../ActionBar';
import ActionMenu from '../Jacinto/ActionMenu'

function Portrait ({actor}) {
  return (
    <div className="Portrait" style={{
      backgroundColor: actor.renderer.background, 
      color: actor.renderer.color,
      borderColor: actor.renderer.color,
    }}>
      {actor.renderer.sprite ? actor.renderer.sprite : actor.renderer.character}
    </div>
  )
}

function StatusEffect ({effect}) {
  return (
    <div className="StatusEffects__effect" style={{
      backgroundColor: effect.renderer.background, 
      color: effect.renderer.color,
      borderColor: effect.renderer.color,
    }}>
      {effect.renderer.sprite ? effect.renderer.sprite : effect.renderer.character}
    </div>
  )
}

function StatusEffects ({actor}) {
  return (
    <div className="StatusEffects">
      {
        actor.game.engine.getStatusEffectsByActorId(actor.id).map((effect, i) => {
          return (
            <Tooltip 
              key={i}
              title={effect.name}
              text={effect.name}
            >
              <StatusEffect effect={effect} />
            </Tooltip>
          )
        })
      }
    </div>
  )
}

function NamePlate ({actor}) {
  return (
    <div className="NamePlate">
      {actor.name}
    </div>
  )
}

function ProgressBar ({
  actor, 
  label, 
  colorFilled = 'red',
  colorEmpty = 'gray',
  attributePathMax, 
  attributePath, 
  unit,
}) {
  const valueMax = _.get(actor, attributePathMax, 0) / unit;
  const valueCurrent = _.get(actor, attributePath, 0) / unit;
  return (
    <div className="ProgressBar">
      <div>
        <span className='ProgressBar__label'>{label}</span>
      </div>
      <div>
        <div className='ProgressBar__blips'>
          {
            Array(valueMax).fill(true).map((blip, index) => {
              return (
                <span 
                  key={index}
                  className='ProgressBar__blips__blip' 
                  style={{backgroundColor: valueCurrent > index ? colorFilled : colorEmpty }}
                />
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

function CharacterCard ({actor, game}) {
  return (
    <div className='CharacterCard'>
      <div>
        <NamePlate actor={actor}/>
        <Portrait actor={actor}/>
        <ProgressBar 
          label='Action Points'
          attributePath='energy'
          attributePathMax='speed'
          colorFilled='#ff9926'
          unit={100}
          actor={actor} 
        />
        <ProgressBar 
          label='Health Points'
          attributePath='durability'
          attributePathMax='durabilityMax'
          colorFilled='#dc322f'
          unit={1}
          actor={actor} 
        />
        <ProgressBar 
          label='Upgrade Points'
          attributePath='upgrade_points'
          attributePathMax='upgrade_points'
          colorFilled='#3e7dc9'
          unit={1}
          actor={actor} 
        />
        <StatusEffects actor={actor} />
      </div>
      <div>
        {/* <ActionBar keymap={game.visibleKeymap} game={game} /> */}
        {/* <ActionBar keymap={actor.getKeymap()} game={game} /> */}
        <ActionMenu keymap={actor.getKeymap()} game={game} />
      </div>
    </div>
  )
}

export default CharacterCard;
