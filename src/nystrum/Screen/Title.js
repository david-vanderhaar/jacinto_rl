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
          <div className={`Jacinto_Help`}>
            <div className="modal-content">
              <div className="row">
                <div className="col s12 m6">
                  <div className="Jacinto_Help__section_header">Goal</div>
                  <div className="Jacinto_Help__section_body">
                    Defend Jacinto, the last human bastion on Sera. Move block by block and clear the city of
              <span className="red-text">&nbsp;Grubs</span> until you can locate and defeat their leader,
              <span className="red-text">&nbsp;Skorge</span>.
            </div>
                </div>
                <div className="col s12 m6">
                  <div className="Jacinto_Help__section_header">Hints</div>
                  <div className="Jacinto_Help__section_body">
                    <div>Destroy <span className="red-text">Emergence Holes</span> ASAP.</div>
                    <div>Spend <span className="blue-text">Upgrade Points</span>.</div>
                    <div>Weapon <span className="blue-text">accuracy</span> decreases over distance.</div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col s12">
                  <div className="Jacinto_Help__section_header">Controls</div>
                  <div className="Jacinto_Help__section_body">
                    <div>Movement: WASD</div>
                    <div>Actions: click or key press</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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