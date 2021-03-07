import React from 'react';
import Button from './Button';

class Information extends React.Component {
  render() {
    let data = [
      {
        label: 'Wave',
        value: `Current: ${this.props.game.mode.data.level}, Highest: ${this.props.game.mode.data.highestLevel}`,
      },
    ];

    data = data.concat(
      [
        ...this.props.game.engine.actors.map((actor, index) => {
          let result = {
            label: actor.name,
            // value: index,
            value: `HP: ${actor.durability}, En/Sp: ${actor.energy}/${actor.speed}`,
          };
          if (index === this.props.game.engine.currentActor) {
            result['color'] = 'red';
          }
          return result;
        })
      ]
    )

    return (
      <div className="Information UI">
        {
          data && (
            data.map((item, index) => {
              return (
                <Button key={index} color={item['color']} onClick={() => null}>
                  {`${item.label}: ${item.value}`}
                </Button>
              )
            })
          )
        }
      </div>
    );
  }
}

export default Information;