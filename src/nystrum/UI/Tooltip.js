import React from 'react';

function Tooltip ({title = 'Effect', text = '', children}) {
  return (
    <div className="Tooltip">
      {children}
      <div className="top">
        <h3>{title}</h3>
        <p>{text}</p>
        <i></i>
      </div>
    </div>
  )
}

export default Tooltip;
