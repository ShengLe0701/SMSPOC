import React from 'react';

export default function Tooltip(props) {
  return (
    <div className={`AaTooltip theme-align-${props.align}`}>
      {props.children}
      <div className="AaTooltip-text">
        {props.text}
      </div>
    </div>
  );
}

Tooltip.propTypes = {
  children: React.PropTypes.element.isRequired,
  text: React.PropTypes.string,
  align: React.PropTypes.string,
};
