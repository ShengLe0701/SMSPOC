import React from 'react';
import { TextInput } from 'react-native';
import _ from 'lodash';

import color from 'style/color';

export default function Input(props) {
  const newProps = _.assign({}, props, {
    style: [{
      color: color.white,
      height: 40,
      borderWidth: 0.5,
      borderColor: color.white,
      borderRadius: 4,
      paddingRight: 12,
      paddingLeft: 12,
    }, props.style],
    placeholderTextColor: color.grayLighter,
    underlineColorAndroid: 'transparent',
  });

  return <TextInput {...newProps} />;
}

Input.propTypes = {
  style: React.PropTypes.object,
  iRef: React.PropTypes.func,
};
