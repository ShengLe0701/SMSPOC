import _ from 'lodash';
import React from 'react';

export default function Avatar(props) {
  const initials = _.map(_.split(props.name, ' ', 2), w => w.charAt(0)).join('');
  return (
    <div className={`Avatar ${props.themePrimary ? 'theme-primary' : ''}`}>
      {initials}
    </div>
  );
}

Avatar.propTypes = {
  themePrimary: React.PropTypes.bool,
  name: React.PropTypes.string,
};
