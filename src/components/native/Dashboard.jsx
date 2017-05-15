import React from 'react';
import { View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import SideMenu from 'react-native-side-menu';

import * as actions from 'actions/native';
import Menu from 'components/native/Menu';
import Chat from 'components/native/Chat';
import color from 'style/color';

function Dashboard(props) {
  return (
    <View
      style={{
        backgroundColor: color.grayDark,
        flex: 1,
      }}
    >
      <SideMenu
        menu={<Menu />}
        isOpen={props.isMenuOpen}
        onChange={props.setMenuOpen}
      >
        <Chat />
      </SideMenu>
    </View>
  );
}

Dashboard.propTypes = {
  isMenuOpen: React.PropTypes.bool,
  setMenuOpen: React.PropTypes.func,
};

export default connect(
  state => ({
    isMenuOpen: state.getIn(['native', 'isMenuOpen']),
  }),
  dispatch => ({
    setMenuOpen: isOpen => {
      dispatch(actions.setMenuOpen(isOpen));
      Keyboard.dismiss();
    },
  })
)(Dashboard);
