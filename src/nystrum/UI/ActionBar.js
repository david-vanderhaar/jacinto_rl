import React from 'react';
import * as _ from 'lodash';
import Tooltip from './Tooltip';

function ResourceBlock({ resource, superScript, canPay }) {
  const character = resource.renderer.sprite ? resource.renderer.sprite : resource.renderer.character
  return (
    <div className="ResourceBlock" style={{
      backgroundColor: canPay ? resource.renderer.background : '#616161',
      color: canPay ? resource.renderer.color : '#bdbdbd',
      borderColor: canPay ? resource.renderer.color : '#bdbdbd',
      fontFamily: 'scroll-o-script',
      width: superScript ? 'auto' : 20,
    }}>
      {`${superScript ? superScript + ' ' : ''}${character}`}
    </div>
  )
}

class ActionBar extends React.Component {
  render() {
    return (  
      <div className="ActionBar">
        <div className="CharacterActions">
          {
            
            this.props.keymap && (
              Object.entries(this.props.keymap).map(([key, getAction], index) => {
                const action = getAction();
                const hidden = _.get(action, 'hidden', false);
                const renderer = _.get(action, 'renderer', null);
                const reqs = action.listPayableResources();

                if (!hidden) {
                  return (
                    <Tooltip
                      key={`${index}-label`}
                      title={action.label}
                      text={action.label + ` ${action.actor.name}`}
                    >
                      <div 
                        className="CharacterActions__item"
                        onClick={() => {
                          action.setAsNextAction();
                          if (!this.props.game.engine.isRunning) this.props.game.engine.start();
                          this.props.game.refocus();
                        }}
                      >
                        <div className="CharacterActions__item__label">
                          {key}
                        </div>
                        <div className="CharacterActions__item__content" style={renderer && {
                          backgroundColor: renderer.background,
                          color: renderer.color,
                          borderColor: renderer.color,
                        }}>
                          {action.label}
                        </div>
                        <div className="CharacterActions__item__resources">
                          {
                            reqs.map((req, i) => {
                              const numBlocks = req.getResourceCost();
                              return numBlocks > 0 && (
                                <ResourceBlock
                                  key={`${i}-${req.name}-resource-block`}
                                  superScript={numBlocks}
                                  resource={req}
                                  canPay={req.canPay}
                                />
                              )
                            })
                          }
                        </div>
                      </div>
                    </Tooltip>
                  )
                }
              })
            )
          }
        </div>
      </div>
    );
  }
}

export default ActionBar;