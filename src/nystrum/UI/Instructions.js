import React from 'react';
import { SCREENS } from '../Screen/constants';
import * as _ from 'lodash';

class Instructions extends React.Component {
  render() {
    const infoHeader = _.get(this.props.game, 'mode.infoHeader', null);
    const infoBlocks = _.get(this.props.game, 'mode.infoBlocks', {});

    return (
      <div className="Instructions UI">
        {infoHeader && (<p className='flow-text'>{infoHeader}</p>)}
        <div className='flow-text'>
          {
            _.map(infoBlocks, (value, key) => {
              return (
                <div key={key} className='Instructions__block'>
                  {value.text}
                </div>
              )
            })
          }
          <div 
            className='Instructions__block'
            onClick={() => this.props.setActiveScreen(SCREENS.TITLE)}
          >
            <button className='btn btn-main'>
              Restart
            </button>
          </div>
          <div 
            className='Instructions__block'
            onClick={() => this.props.toggleSpriteMode()}
          >
            <button className='btn btn-main'>
              {
                this.props.spriteMode ? (
                  'ASCII mode'
                ) : (
                  'Sprite mode'
                )
              }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Instructions;