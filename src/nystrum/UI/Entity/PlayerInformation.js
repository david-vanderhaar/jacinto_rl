import React from 'react';
import CharacterCard from './CharacterCard';
import * as _ from 'lodash';

const PlayerInformation = ({game}) => {
  const actors = game.engine.actors.filter((actor) => actor.entityTypes.includes('PRESENTING_UI')).filter((actor) => actor.presentingUI)
  return (
    <div className="PlayerInformation Information UI">
      <div className='CharacterCard_Container'>
        {
          actors.map((actor, index) => <CharacterCard key={index} actor={actor} game={game} />)
        }
      </div>
    </div>
  );
}

export default PlayerInformation;