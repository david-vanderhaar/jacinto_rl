import React from 'react';
import {
  GiStarSkull,
} from "react-icons/gi";
import { SCREENS } from './constants';


class Lose extends React.Component {
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
            backgroundColor: '#222',
          }}
        >
          <h2 className="Title__header">
            <GiStarSkull />
            <GiStarSkull />
            <GiStarSkull />
          </h2>
          <button
            style={{
              margin: 'initial',
            }}
            className={`CharacterSelect__button btn btn-main`}
            onClick={() => window.location.reload()}
          >
            Restart
          </button>
          <h2 className="Title__header">
            <GiStarSkull />
            <GiStarSkull />
            <GiStarSkull />
          </h2>
        </div>
      </div>
    );
  }
}

export default Lose;