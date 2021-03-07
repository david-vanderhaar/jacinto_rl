import React from 'react';
import Button from './Button';
import * as _ from 'lodash';

function ResourceBlock({ resource }) {
  return (
    <div className="StatusEffects__effect" style={{
      backgroundColor: resource.renderer.background,
      color: resource.renderer.color,
      borderColor: resource.renderer.color,
      fontFamily: 'scroll-o-script',
    }}>
      {resource.renderer.character}
    </div>
  )
}

class Keymap extends React.Component {
  render() {
    return (  
      <div className="Keymap UI">
        <div className='flow-text center'>Keymap</div>
        {
          
          this.props.keymap && (
            Object.entries(this.props.keymap).map(([key, getAction], index) => {
              const action = getAction();
              const hidden = _.get(action, 'hidden', false);
              const color = key === 'Escape' ? 'amber darken-3' : 'grey darken-1';

              if (!hidden) {
                return (
                  <Button 
                    key={`${index}-label`}
                    onClick={() => {
                        action.setAsNextAction();
                        if (!this.props.game.engine.isRunning) this.props.game.engine.start();
                        this.props.refocus();
                      } 
                    }
                    color={color}
                  >
                    {key} {action.label}
                  </Button>
                )
              }
            })
          )
        }
      </div>
    );
  }
}

export default Keymap;