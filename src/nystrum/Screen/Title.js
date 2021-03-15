import React from 'react';
import {
  GiCog,
  GiStarSkull,
} from "react-icons/gi";
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
          className="Title__content"
          style={{

            width: '100vw',
            height: '100vh',
            backgroundColor: '#07111Dff',
            // backgroundImage: `url("${window.PUBLIC_URL}/icons/512x512.png")`,
            // backgroundRepeat: 'no-repeat',
            // backgroundPosition: 'center',
            // backgroundPositionY: '10px'

          }}
        >
          <h2 className="Title__header"><GiCog/></h2>
          <button
            style={{
              margin: 'initial',
            }}
            className={`CharacterSelect__button btn btn-main`}
            onClick={() => {
              this.props.setActiveScreen(SCREENS.CHARACTER_SELECT)
            }}
          >
            Defend Jacinto
          </button>
          <h2 className="Title__header"><GiStarSkull /></h2>
        </div>
      </div>
    );
  }
}

export default Title;