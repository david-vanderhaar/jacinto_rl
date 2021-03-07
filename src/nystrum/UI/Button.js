import React from 'react';

function Button(props) {
  let color = props['color'];
  if (!color) color = 'grey';
  return (
    <button
      onClick={props.onClick}
      className={`Button btn ${color}`}
    >
      {props.children}  
    </button>
  )
}

export default Button;
