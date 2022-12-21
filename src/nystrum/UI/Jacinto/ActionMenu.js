import React from 'react';
import * as _ from 'lodash';
import Tooltip from '../Tooltip';

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
      {/* {`${superScript ? superScript + ' ' : ''}${character}`} */}
      {superScript}
    </div>
  )
}

const ActionMenu = ({keymap, game}) => {
  return (  
    <div className="Jacinto__ActionMenu">
      <div className="Jacinto__ActionMenu__Actions">
        {
          keymap && (
            Object.entries(keymap).map(([key, getAction], index) => {
              const action = getAction();
              const hidden = _.get(action, 'hidden', false);
              const renderer = _.get(action, 'renderer', null);
              const reqs = action.listPayableResources();

              if (!hidden) {
                return (
                  <div
                    key={`${index}-label`}
                    className="Jacinto__ActionMenu__Actions__item"
                    onClick={() => {
                      action.setAsNextAction();
                      if (!game.engine.isRunning) game.engine.start();
                      game.refocus();
                    }}
                  >
                    <div className="Jacinto__ActionMenu__Actions__item__label">
                      {key}
                    </div>
                    <div className="Jacinto__ActionMenu__Actions__item__content" style={renderer && {
                      backgroundColor: renderer.background,
                      color: renderer.color,
                      borderColor: renderer.color,
                    }}>
                      {action.label}
                    </div>
                    <div className="Jacinto__ActionMenu__Actions__item__resources">
                      {
                        reqs.map((req, i) => {
                          const numBlocks = req.getResourceCostDisplay();
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
                )
              }
            })
          )
        }
      </div>
    </div>
  );
}

export default ActionMenu;