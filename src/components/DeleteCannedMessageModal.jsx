import React from 'react';
import { connect } from 'react-redux';

import ModalWrapper from 'components/ModalWrapper';
import * as actions from 'actions';

class DeleteCannedMessageModal extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onDeleteCannedMessage(this.props.selectedCannedMessage.get('id'));
  }

  render() {
    return (
      <ModalWrapper
        modalTitle={this.props.modalTitle}
        okText={this.props.okText}
        onOk={this.handleSubmit}
      >
        <form onSubmit={this.handleSubmit}>
          <div className="form-check">
            <p>
              This action will delete the message template
              "{this.props.selectedCannedMessage.get('title')}" forever. Are you sure?
            </p>
          </div>
        </form>
      </ModalWrapper>
    );
  }
}

DeleteCannedMessageModal.propTypes = {
  okText: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  onDeleteCannedMessage: React.PropTypes.func,
  selectedCannedMessage: React.PropTypes.object,
};

export default connect(
  state => ({
    selectedCannedMessage: state.getIn(['cannedMessages', 'selected']),
  }),
  dispatch => ({
    onDeleteCannedMessage: (cannedMessageId) => {
      dispatch(actions.deleteCannedMessage(cannedMessageId));
      dispatch(actions.hideModal());
    },
  })
)(DeleteCannedMessageModal);
