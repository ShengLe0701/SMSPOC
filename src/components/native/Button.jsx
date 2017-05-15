import React from 'react';
import ApButton from 'apsl-react-native-button';
import _ from 'lodash';

import s from 'style/sheets';
import color from 'style/color';

export default function Button(props) {
  let bgColor;
  let textColor;

  switch (props.type) {
    case 'link':
      bgColor = 'transparent';
      textColor = color.primary;
      break;
    case 'primary':
      bgColor = color.primary;
      textColor = color.white;
      break;
    case 'inverse-primary':
      bgColor = color.white;
      textColor = color.primary;
      break;
    case 'default':
    default:
      bgColor = color.grayLight;
      textColor = color.white;
      break;
  }

  const newProps = _.assign({}, props, {
    style: [{
      backgroundColor: bgColor,
      borderRadius: 4,
      borderWidth: 0,
      height: 40,
      marginBottom: 0,
    }, props.style],
    textStyle: [s.b1, {
      color: textColor,
    }, props.textStyle],
  });

  return (
    <ApButton {...newProps} />
  );
}

Button.propTypes = {
  style: React.PropTypes.object,
  textStyle: React.PropTypes.object,
  type: React.PropTypes.oneOf([
    'link',
    'default',
    'primary',
    'inverse-primary',
  ]),
};
