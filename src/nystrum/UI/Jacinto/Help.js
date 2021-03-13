import React from 'react';
import {COLORS} from '../../Modes/Jacinto/theme';

function Help(props) {
  React.useLayoutEffect(() => {
    var elems = document.querySelectorAll(`#${props.id}`);
    window.M.Modal.init(elems)
  })
  return (
    <div id={props.id} className={`Jacinto_Help modal`}>
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
              <div>Stay in cover.</div>
              <div>Destroy <span className="red-text">Emergence Holes</span> ASAP.</div>
              <div>Spend <span className="blue-text">Upgrade Points</span></div>
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
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

export default Help;