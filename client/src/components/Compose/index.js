import React from 'react';
import './Compose.css';

export default function Compose(props) {
  return (
    <div className="compose">
      <input
        type="text"
        value={props.msg}
        onChange={e => props.setMsg(e.target.value)}
        onKeyDown={props.handleKeyDown}
        className="compose-input"
        placeholder="Type a message, @name"
      />

      {
        props.rightItems
      }
    </div>
  );
}