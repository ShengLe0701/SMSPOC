/*
 borrowed from https://medium.com/@david.gilbertson/modals-in-react-f6c3ff9f4701
*/

import React from 'react';
import { connect } from 'react-redux';
const { PropTypes } = React;

import * as actions from 'actions';

const ModalWrapper = props => {
  const onOk = (...args) => {
    props.onOk(...args);
  };

  const footer =
    props.showOk ? (
      <div className="modal-footer">
        <button
          className="btn btn-block btn-primary"
          onClick={onOk}
          disabled={props.okDisabled}
        >
          {props.okText}
        </button>
      </div>
    ) : null;

  return (
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <div className="d-flex w-100 justify-content-between align-items-start">
            <div className="h4 mb-0">{props.modalTitle}</div>
            <div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => props.hideModal()}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        <div className="modal-body">
          {props.children}
        </div>
        {footer}
      </div>
    </div>
  );
};

ModalWrapper.propTypes = {
  // props
  modalTitle: PropTypes.string,
  showOk: PropTypes.bool,
  okText: PropTypes.string,
  okDisabled: PropTypes.bool,
  width: PropTypes.number,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
    PropTypes.string,
  ]).isRequired,

  // methods
  hideModal: PropTypes.func,
  onOk: PropTypes.func,
};

ModalWrapper.defaultProps = {
  modalTitle: '',
  showOk: true,
  okText: 'OK',
  okDisabled: false,
  width: 400,
  onOk: () => {},
};

export default connect(
  () => ({}),
  dispatch => ({
    hideModal: () => dispatch(actions.hideModal()),
  })
)(ModalWrapper);
