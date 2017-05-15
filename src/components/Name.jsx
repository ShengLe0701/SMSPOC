import React from 'react';
import { Map } from 'immutable';

export default function Name(props) {
  if (props.contact.get('isVerified') === false) {
    return <em>unverified guest</em>;
  }
  return <span>{props.contact.get('name')}</span>;
}

Name.propTypes = {
  contact: React.PropTypes.instanceOf(Map),
};
