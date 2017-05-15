import React from 'react';
import { connect } from 'react-redux';

import ModalConductor from 'components/ModalConductor';
import * as actions from 'actions';

function ModalContainer(props) {
  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      props.hideModal();
    }
  };

  return (
    <div
      className="modal"
      id="sd-modal"
      tabIndex="-1"
      role="dialog"
      onClick={handleBackgroundClick}
    >
      <ModalConductor />
    </div>
  );
}

ModalContainer.propTypes = {
  hideModal: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    hideModal: () => dispatch(actions.hideModal()),
  })
)(ModalContainer);
