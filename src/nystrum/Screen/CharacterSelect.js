import React from 'react';
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
          style={{

            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgb(4, 49, 61)',
            backgroundImage: `url("${window.PUBLIC_URL}/fire_man_blue.jpg")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundPositionY: '10px'

          }}
        >
          <CharacterSelect 
            characters={this.props.characters} 
            selectedCharacter={this.props.selectedCharacter} 
            setSelectedCharacter={this.props.setSelectedCharacter}
            setActiveScreen={this.props.setActiveScreen}
          />
        </div>
      </div>
    );
  }
}

export default Title;