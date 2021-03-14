import React from 'react';
import {
  GiCog,
} from "react-icons/gi";

class Win extends React.Component {
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
            backgroundColor: '#3e7dc9',
          }}
        >
          <h2 className="Title__header">
            <GiCog />
            <GiCog />
            <GiCog />
          </h2>
          <button
            style={{
              margin: 'initial',
            }}
            className={`CharacterSelect__button btn btn-main`}
            onClick={() => window.location.reload()}
          >
            Victory
          </button>
          <h2 className="Title__header">
            <GiCog />
            <GiCog />
            <GiCog />
          </h2>
        </div>
      </div>
    );
  }
}

export default Win;