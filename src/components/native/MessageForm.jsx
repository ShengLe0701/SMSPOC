import React from 'react';
import { connect } from 'react-redux';
import { Keyboard, View, TextInput } from 'react-native';

import * as actions from 'actions';
import Button from 'components/native/Button';
import color from 'style/color';
import s from 'style/sheets';

const style = {
  height: 40,
  flexDirection: 'row',
  backgroundColor: color.white,
  borderTopWidth: 0.5,
  borderColor: color.grayLight,
  paddingLeft: 12,
  paddingRight: 12,
};

function MessageForm(props) {
  if (props.disabled) {
    return (
      <View style={style}>
        <Text style={[s.b1, s.textDanger]}>
          The guest unsubscribed.
        </Text>
      </View>
    );
  }

  return (
    <View style={style} >
      <TextInput
        style={{
          color: color.grayDark,
          height: 40,
          borderWidth: 0,
          marginRight: 8,
          flex: 1,
        }}
        placeholder="Type your message here"
        value={props.draftBody}
        onChangeText={props.updateDraft}
        placeholderTextColor={color.grayLight}
        underlineColorAndroid="transparent"
        onSubmitEditing={() => props.submitMessage(props.draftBody)}
      />
      <Button
        onPress={() => props.submitMessage(props.draftBody)}
        type="link"
        style={{ flex: 0, width: 60, justifyContent: 'flex-end' }}
        textStyle={{ flex: 0 }}
        isDisabled={props.disabled}
      >
        Send
      </Button>
    </View>
  );
}

MessageForm.propTypes = {
  chatType: React.PropTypes.string,
  chatId: React.PropTypes.string,
  draftBody: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  updateDraft: React.PropTypes.func,
  submitMessage: React.PropTypes.func,
};

export default connect(
  (state, props) => ({
    draftBody: state.getIn(['drafts', props.chatType, props.chatId]) || '',
  }),
  (dispatch, props) => ({
    updateDraft: body => (
      dispatch(actions.updateDraft(props.chatType, props.chatId, body))
    ),
    submitMessage: body => {
      if (!props.disabled && body) {
        dispatch(actions.sendTextMessage(props.chatType, props.chatId, body));
        Keyboard.dismiss();
      }
    },
  })
)(MessageForm);
