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

class CannedMessageInput extends React.Component {
  constructor(props) {
    super(props);

    this.onUpdateDraft = props.onUpdateDraft.bind(this);
  }

  renderTemplate(template, context) {
    return template.replace(/\$\{(.*?)\}/g, (match, key) => context.get(key));
  }

  render() {
    const cannedMessageListView = this.props.cannedMessageList
    .filter(cannedMessage => cannedMessage.get('active'))
    .map(cannedMessage => (
      <a
        key={`cannedMessage-${cannedMessage.get('id')}`}
        className="dropdown-item"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          this.props.onUpdateDraft(
            'GUEST',
            this.props.guest.get('id'),
            this.renderTemplate(
              cannedMessage.get('message'),
              this.props.guest.filter((v, k) => AVAILABLE_KEYS.has(k))
            )
          );
        }}
      >
        {cannedMessage.get('title')}
      </a>
    ));

    return (
      <div className="input-group-btn dropup">
        <button type="button" className="btn btn-secondary" data-toggle="dropdown">
          <i className="fa fa-plus"></i>
        </button>
        <div className="dropdown-menu">
          <h6 className="dropdown-header">Message Templates</h6>
          {cannedMessageListView}
        </div>
      </div>
    );
  }
}

CannedMessageInput.propTypes = {
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
)(CannedMessageInput);
