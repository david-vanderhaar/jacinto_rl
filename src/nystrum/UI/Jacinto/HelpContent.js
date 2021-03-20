import React from 'react';
import {COLORS} from '../../Modes/Jacinto/theme';

function HelpContent() {
  return (
    <div className="Jacinto_Help">
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
              <div><span className="blue-text">Grenades</span> can destroy walls as well as grubs, but be wary.</div>
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
  )
}

export default HelpContent;