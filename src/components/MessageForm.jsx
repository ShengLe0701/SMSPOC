import React from 'react';
import { connect } from 'react-redux';

import autosize from 'autosize';

import { ChatType } from 'constants.js';
import * as actions from 'actions';
import AttachmentForm from 'components/AttachmentForm';
import CannedMessageInput from 'components/CannedMessageInput';

class MessageForm extends React.Component {
  constructor(props) {
    super(props);

    this.onTextareaKeyDown = this.onTextareaKeyDown.bind(this);
  }

  componentDidMount() {
    autosize(this.textarea);
  }

  componentDidUpdate() {
    autosize.update(this.textarea);
  }

  componentWillUnmount() {
    autosize.destroy(this.textarea);
  }

  onTextareaKeyDown(event) {
    // 13 is Enter.
    if (event.keyCode === 13 && !event.ctrlKey && !event.shiftKey) {
      this.props.onMessageSubmit(
        this.props.draftBody
      )(event);
    }
  }

  render() {
    return (
      <div className="MessageForm">
        <div className="MessageForm-textGroup">
          <form onSubmit={this.props.onMessageSubmit(this.props.draftBody)} >
            <fieldset disabled={this.props.disabled}>
              <div className="input-group">
                {
                  this.props.chatType === ChatType.GUEST ? <CannedMessageInput /> : ''
                }
                <textarea
                  rows="1"
                  className="form-control"
                  placeholder="Type your message here"
                  value={this.props.draftBody}
                  onChange={e => {
                    this.props.onUpdateDraft(
                      this.props.chatType, this.props.chatId, e.target.value
                    );
                  }}
                  onKeyDown={this.onTextareaKeyDown}
                  ref={t => { this.textarea = t; }}
                />
                <span className="input-group-btn">
                  <button className="btn btn-primary" type="submit">Send</button>
                </span>
              </div>
            </fieldset>
          </form>
        </div>
        <div className="MessageForm-attach">
          <AttachmentForm
            chatType={this.props.chatType}
            chatId={this.props.chatId}
            onFileSelect={this.props.onFileSelect}
          />
        </div>
      </div>
    );
  }
}

MessageForm.propTypes = {
  chatType: React.PropTypes.string,
  chatId: React.PropTypes.string,
  draftBody: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  onUpdateDraft: React.PropTypes.func,
  onMessageSubmit: React.PropTypes.func,
  onFileSelect: React.PropTypes.func,
};

export default connect(
  (state, props) => ({
    draftBody: state.getIn(['drafts', props.chatType, props.chatId]) || '',
  }),
  (dispatch, props) => ({
    onUpdateDraft: (chatType, chatId, body) => (
      dispatch(actions.updateDraft(chatType, chatId, body))
    ),
    onMessageSubmit: body => (
      event => {
        event.preventDefault();
        if (body) {
          dispatch(actions.sendTextMessage(props.chatType, props.chatId, body));
        }
      }
    ),
    onFileSelect: event => {
      const file = event.target.files[0];
      if (file) {
        dispatch(actions.sendFileMessage(props.chatType, props.chatId, file));
      }
    },
  })
)(MessageForm);
