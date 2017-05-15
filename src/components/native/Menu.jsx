import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { GuestsList, UsersList } from 'components/native/ContactList';
import Container from 'components/native/Container';
import Button from 'components/native/Button';
import s from 'style/sheets';
import * as actions from 'actions';
import color from 'style/color';

function Menu(props) {
  return (
    <Container backgroundColor={color.grayDark}>
      <ScrollView style={{ flex: 1, alignSelf: 'stretch', paddingRight: 12 }}>
        <Button
          type="link"
          onPress={props.logout}
          style={{ marginLeft: 12, justifyContent: 'flex-start' }}
          textStyle={{ flex: 0 }}
        >
          Log out
        </Button>
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: color.gray,
            marginBottom: 12,
          }}
        >
          <Text style={[s.h4, s.textInverse, { marginLeft: 12, marginBottom: 0 }]}>
            Guests
          </Text>
        </View>
        <GuestsList />
        <View
          style={{
            borderTopWidth: 0.5,
            borderBottomWidth: 0.5,
            borderColor: color.gray,
            marginTop: 12,
            marginBottom: 12,
          }}
        >
          <Text style={[s.h4, s.textInverse, { marginLeft: 12, marginBottom: 0 }]}>
            Staff
          </Text>
        </View>
        <UsersList />
      </ScrollView>
    </Container>
  );
}

Menu.propTypes = {
  logout: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    logout: () => dispatch(actions.logout()),
  })
)(Menu);
