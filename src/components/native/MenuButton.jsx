import React from 'react';
import { View, TouchableHighlight } from 'react-native';

import color from 'style/color';

export default function MenuButton(props) {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      underlayColor={color.primaryDark}
      style={{
        position: 'absolute',
        zIndex: 1,
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 14,
        paddingBottom: 14,
      }}
    >
      <View>
        <View style={{ backgroundColor: color.white, height: 1, marginBottom: 5 }} />
        <View style={{ backgroundColor: color.white, height: 1, marginBottom: 5 }} />
        <View style={{ backgroundColor: color.white, height: 1 }} />
      </View>
    </TouchableHighlight>
  );
}

MenuButton.propTypes = {
  onPress: React.PropTypes.func,
};
