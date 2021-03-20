import React from 'react';
import * as _ from 'lodash';

function InfoBlocks(props) {
  return (
    <div>
      {
        _.map(_.get(props.game, 'mode.infoBlocks', {}), (value, key) => {
          return (
            <div key={key} className='Instructions__block Instructions__block--Jacinto'>
              {value.text}
            </div>
          )
        })
      } 
    </div>
  )
}

export default InfoBlocks;
