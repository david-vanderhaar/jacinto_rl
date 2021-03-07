import React from 'react';
import { SCREENS } from '../Screen/constants';

const ModeSelect = (props) => {
  return (
    <div className='CharacterSelect'>
      {
        props.modes.map((mode, index) => {
          let color = '';
          if (props.selectedMode) {
            color = props.selectedMode.name === mode.name ? 'red' : ''
          }

          return (
            <button
              key={index}
              style={{
                position: 'relative',
                top: '280px'
              }}
              className={`CharacterSelect__button btn btn-main`}
              onClick={() => {
                console.log(mode);
                
                props.setSelectedMode(mode)
                props.setActiveScreen(SCREENS.CHARACTER_SELECT)
              }}
            >
              {mode.name}
            </button>
          )
        })
      }
    </div>
  );
}

export default ModeSelect;