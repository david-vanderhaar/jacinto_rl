import React from 'react';
import { JACINTO_SOUND_MANAGER } from '../../Modes/Jacinto/sounds';
import HelpContent from './HelpContent';

let masterVolume = 30

function Help(props) {
  React.useLayoutEffect(() => {
    var elems = document.querySelectorAll(`#${props.id}`);
    window.M.Modal.init(elems)
  })
  return (
    <div id={props.id} className="modal">
      <HelpContent />
        <div className="range-field">
          <input
            id='volume'
            type="range"
            min="0"
            max="100"
            defaultValue={masterVolume}
            step="1"
            onChange={(event) => {
              const volume = event.target.value
              masterVolume = volume
              JACINTO_SOUND_MANAGER.setVolume(volume / 100)
            }}
          />
          <label htmlFor="volume">Master Volume</label>
        </div>
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

export default Help;