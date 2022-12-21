import React from 'react';
import {
  GiCrosshair,
  GiBullets,
  GiBackwardTime,
  GiBarbedArrow,
  GiBurningDot,
} from "react-icons/gi";
import {EquipItemFromContainer} from '../../Actions/EquipItemFromContainer';
import {STAT_RENDERERS} from '../../Modes/Jacinto/theme';

function StatBlock({stat}) {
  const {getIcon, value, name} = stat;
  const character = stat.renderer.sprite ? stat.renderer.sprite : stat.renderer.character
  return (
    <div 
      className="StatBlock" 
      style={{
        backgroundColor: stat.renderer.background,
        color: stat.renderer.foreground,
        borderColor: stat.renderer.foreground,
        fontFamily: 'scroll-o-script',
        width: stat.value !== null ? 'auto' : 20,
      }}
      title={name}
    >
      {
        getIcon ? getIcon() : `${character}`
      }
      <span>&nbsp;{value}</span>
    </div>
  )
}

const SimpleEquipmentCard = ({game, player, data}) => {
  const {
    item,
    equipped,
    amount,
    equipable,
  } = data;

  let onClick = () => null;
  if (equipable) {
    const action = new EquipItemFromContainer({
      item,
      game,
      energyCost: 0,
      actor: player,
      label: `Equip ${item.name}`,
    });
    onClick = () => {
      game.refocus();
      action.setAsNextAction();
      game.engine.start();
    }
  }

  let needsReload = false;
  if (item.hasOwnProperty('magazine')) {
    if (item.magazine <= 0) {
      needsReload = true;
    }
  }

  return (
    <div 
      className={`SimpleEquipmentCard EquipmentCard ${equipped ? 'EquipmentCard--selected' : ''}`} 
      onClick={() => game.refocus()}
    >
      {needsReload && (
        <div
          className="EquipmentCard__reload_overlay"
          onClick={onClick}
        >
          <div className="EquipmentCard__reload_overlay__text">Needs Reload</div>
          <div className="EquipmentCard__reload_overlay__text"><GiBackwardTime /></div>
        </div>
      )}
      <div
        className="EquipmentCard__item"
        onClick={onClick}
      >
        <div className="EquipmentCard__item__label--simple">
        <span class="EquipmentCard__item__label__amount">{amount || 1}</span> {item.name}
        </div>
      </div>
    </div>
  )
}

const EquipmentCard = (props) => {
  const {
    game,
    player,
    data,
  } = props;
  const {
    item,
    equipped,
    amount,
    equipable,
  } = data;

  let needsReload = false;

  let onClick = () => null;
  if (equipable) {
    const action = new EquipItemFromContainer({
      item,
      game,
      energyCost: 0,
      actor: player,
      label: `Equip ${item.name}`,
    });
    onClick = () => {
      game.refocus();
      action.setAsNextAction();
      game.engine.start();
    }
  }

  let stats = [];
  if (amount) {
    stats.push({
      name: 'amount left',
      value: amount,
      renderer: STAT_RENDERERS.amount,
    })
  }
  if (item.hasOwnProperty('attackRange')) {
    stats.push({
      name: 'attack range',
      value: item['attackRange'],
      renderer: STAT_RENDERERS.attackRange,
      getIcon: () => <GiBarbedArrow />,
    })
  }
  if (item.hasOwnProperty('magazine')) {
    stats.push({
      name: 'shots before reload',
      value: item.magazine,
      renderer: STAT_RENDERERS.magazine,
      getIcon: () => <GiBullets />,
    })
    if (item.magazine <= 0) {
      needsReload = true;
    }
  }
  if (item.hasOwnProperty('baseRangedAccuracy')) {
    stats.push({
      name: 'base accuracy',
      value: `${Math.round(item['baseRangedAccuracy'] * 100)}%`,
      renderer: STAT_RENDERERS.baseRangedAccuracy,
      getIcon: () => <GiCrosshair />,
    })
  }
  if (item.hasOwnProperty('baseRangedDamage')) {
    stats.push({
      name: 'base damage',
      value: item['baseRangedDamage'],
      renderer: STAT_RENDERERS.baseRangedDamage,
      getIcon: () => <GiBurningDot />,
    })
  }
  if (item.hasOwnProperty('attackDamage')) {
    stats.push({
      name: 'base melee damage',
      value: item['attackDamage'],
      renderer: STAT_RENDERERS.meleeDamage,
    })
  }
  
  return (
    <div 
      className={`EquipmentCard ${equipped ? 'EquipmentCard--selected' : ''}`} 
      onClick={() => game.refocus()}
    >
      {needsReload && (
        <div
          className="EquipmentCard__reload_overlay"
          onClick={onClick}
        >
          <div className="EquipmentCard__reload_overlay__text">Needs Reload</div>
          <div className="EquipmentCard__reload_overlay__text"><GiBackwardTime /></div>
        </div>
      )}
      <div
        className="EquipmentCard__item"
        onClick={onClick}
      >
        <div className="EquipmentCard__item__label">
          {item.name}
        </div>
        <div className="EquipmentCard__item__content" style={item.renderer && {
          backgroundColor: item.renderer.background,
          color: item.renderer.color,
          borderColor: item.renderer.color,
        }}>
          {item.renderer.sprite ? item.renderer.sprite : item.renderer.character}
        </div>
      </div>
      <div className="EquipmentCard__item__stats">
        {
          stats.map((stat, i) => {
            return (
              <StatBlock
                key={`${i}-${stat.name}-resource-block`}
                stat={stat}
              />
            )
          })
        }
      </div>
    </div>
  )
}

class Equipment extends React.Component {
  render() {
    if (!this.props.player) return null;
    const player = this.props.player;
    const game = this.props.game;
    let items = [];
    player.equipment.forEach((slot) => {
      if (slot.item) {
        items.push({
          item: slot.item,
          equipped: true,
        });
      }
    });
    player.container.forEach((slot) => {
      if (slot.items.length) {
        const item = slot.items[0];
        // disallow duplicates
        if (items.filter((data) => data.item.name === item.name).length === 0) {
          const equipable = item.entityTypes.includes('EQUIPABLE');
          const amount = equipable ? null : slot.items.length;
          items.push({
            item,
            amount,
            equipable,
            equipped: false,
          })
        }
      }
    });
    return (
      <div className="Equipment UI">
        {
          <div>
            <div className='flow-text'>Equipment</div>
            <div>
              {
                items.map((item, index) => {
                  if (item.equipped) {
                    return (
                      <EquipmentCard 
                        key={index}
                        game={game} 
                        player={player} 
                        data={item} 
                      />
                    )
                  } else {
                    return (
                      <SimpleEquipmentCard 
                        key={index}
                        game={game} 
                        player={player} 
                        data={item} 
                      />
                    )

                  }
                })
              }
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Equipment;