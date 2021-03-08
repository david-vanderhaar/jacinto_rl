import React from 'react';
import { SCREENS } from './constants';

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
          <button
            style={{
              position: 'relative',
              top: '280px'
            }}
            className={`CharacterSelect__button btn btn-main`}
            onClick={() => {
              this.props.setActiveScreen(SCREENS.CHARACTER_SELECT)
            }}
          >
            Play
          </button>
        </div>
      </div>
    );
  }
}

export default Title;