import React from 'react';
import CharacterSelect from '../UI/CharacterSelect';

class Win extends React.Component {
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
            // backgroundColor: '#eee',
            backgroundColor: 'rgb(54,160,190)',
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

export default Win;