import React from 'react';
import { connect } from 'react-redux';
import { List, Map, Set } from 'immutable';

import * as actions from 'actions';

const AVAILABLE_KEYS = new Set([
  'name',
  'phone',
  'email',
  'room',
]);

class CannedMessage extends React.Component {
  constructor(props) {
    super(props);

    this.onUpdateDraft = props.onUpdateDraft.bind(this);
  }

  // TODO(ivan): Move this logic to some other place.
  renderTemplate(template, context) {
    return template.replace(/\$\{(.*?)\}/g, (match, key) => context.get(key));
  }

  render() {
    const cannedMessageListView = this.props.cannedMessageList
    .filter(cannedMessage => cannedMessage.get('active'))
    .map(cannedMessage => (
      <button
        key={`cannedMessage-${cannedMessage.get('id')}`}
        type="button"
        className="list-group-item list-group-item-action"
        onClick={() => this.props.onUpdateDraft(
          'GUEST',
          this.props.guest.get('id'),
          this.renderTemplate(
            cannedMessage.get('message'),
            this.props.guest.filter((v, k) => AVAILABLE_KEYS.has(k))
          )
        )}
      >
        {cannedMessage.get('title')}
      </button>
    ));

    if (this.props.guest) {
      return (
        <div className="CannedMessage">
          <h4 className="mb-3">Message templates</h4>
          <div className="list-group">
            {cannedMessageListView}
          </div>
        </div>
      );
    }

    return (
      <div className="CannedMessage-placeholder"></div>
    );
  }
}

CannedMessage.propTypes = {
  guest: React.PropTypes.instanceOf(Map),
  cannedMessageList: React.PropTypes.instanceOf(List),
  onUpdateDraft: React.PropTypes.func,
};

export default connect(
  state => ({
    guest: state.getIn(['guests', 'items', state.getIn(['guests', 'selectedId'])], null),
    cannedMessageList: state.getIn(['cannedMessages', 'items']),
  }),
  dispatch => ({
    onUpdateDraft: (chatType, chatId, body) => (
      dispatch(actions.updateDraft(chatType, chatId, body))
    ),
  })
)(CannedMessage);
