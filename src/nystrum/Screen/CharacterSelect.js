import React from 'react';
import {
  GiCog,
  GiStarSkull,
} from "react-icons/gi";
import { SCREENS } from './constants';
import CharacterSelect from '../UI/CharacterSelect';

class Title extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="Title">
        <div
          className="Title__content"
          style={{
            width: '100vw',
            height: '100vh',
            backgroundColor: '#07111Dff',
          }}
        >
          <h2 className="Title__header"><GiCog/></h2>
          <CharacterSelect 
            characters={this.props.characters} 
            selectedCharacter={this.props.selectedCharacter} 
            setSelectedCharacter={this.props.setSelectedCharacter}
            setActiveScreen={this.props.setActiveScreen}
          />
          <h2 className="Title__header"><GiStarSkull /></h2>
        </div>
      </div>
    );
  }
}

export default Title;