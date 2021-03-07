import React from 'react';
import { SCREENS } from './constants';
import ModeSelect from '../UI/ModeSelect';

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
          <ModeSelect 
            modes={this.props.modes} 
            selectedMode={this.props.selectedMode} 
            setSelectedMode={this.props.setSelectedMode}
            setActiveScreen={this.props.setActiveScreen}
          />
        </div>
      </div>
    );
  }
}

export default Title;