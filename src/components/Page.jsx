import React from 'react';

export default function Page(props) {
  return (
    <div className="Page">
      <div className={props.wide ? 'Page-container' : 'Page-container is-narrow'}>
        {props.children}
      </div>
    </div>
  );
}

Page.propTypes = {
  wide: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.array,
    React.PropTypes.element,
    React.PropTypes.string,
  ]).isRequired,
};

Page.defaultProps = {
  wide: false,
};
