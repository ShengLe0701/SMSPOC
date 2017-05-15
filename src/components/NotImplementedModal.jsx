import React from 'react';
import { connect } from 'react-redux';

import ModalWrapper from 'components/ModalWrapper';
import * as actions from 'actions';

function NotImplementedModal(props) {
  return (
    <ModalWrapper
      modalTitle={props.modalTitle}
      okText={props.okText}
      onOk={props.onOk}
    >
      <form onSubmit={props.onOk}>
        <div className="form-check">
          <p>
            This feature has not been implemented yet
          </p>
        </div>
      </form>
    </ModalWrapper>
  );
}

NotImplementedModal.propTypes = {
  modalTitle: React.PropTypes.string,
  okText: React.PropTypes.string,
  onOk: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    onOk: (event) => {
      event.preventDefault();
      dispatch(actions.hideModal());
    },
  })
)(NotImplementedModal);
