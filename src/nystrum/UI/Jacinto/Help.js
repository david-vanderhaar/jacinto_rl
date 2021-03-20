import React from 'react';
import HelpContent from './HelpContent';

function Help(props) {
  React.useLayoutEffect(() => {
    var elems = document.querySelectorAll(`#${props.id}`);
    window.M.Modal.init(elems)
  })
  return (
    <div id={props.id} className="modal">
      <HelpContent />
      <div className="modal-footer">
        <a href="#!" className="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>
  )
}

export default Help;