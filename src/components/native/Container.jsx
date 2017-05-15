import React from 'react';
import { View, StatusBar, Platform } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import color from 'style/color';

export default function Container(props) {
  return (
    <View
      style={[props.style, {
        flex: 1,
        alignItems: 'stretch',
        backgroundColor: props.backgroundColor || color.primary,
      }]}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <View
        style={{
          height: 20,
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: 'stretch',
          justifyContent: 'center',
        }}
      >
        {props.children}
      </View>
      {Platform.OS === 'ios' ? <KeyboardSpacer /> : <View />}
    </View>
  );
}

Container.propTypes = {
  backgroundColor: React.PropTypes.string,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  style: React.PropTypes.object,
};
