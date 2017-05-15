import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import autosize from 'autosize';

import ModalWrapper from 'components/ModalWrapper';
import * as actions from 'actions';
import { NewCannedMessage, CannedMessageType } from 'constants';

class CannedMessageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      textAreaStyle: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
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

  handleChange(key, value) {
    const data = {};
    data[key] = value;

    this.props.onUpdateCannedMessage(
      _.assign({}, this.props.selectedCannedMessage, data)
    );
  }

  validMessage() {
    const retVal = !_.isEmpty(this.props.selectedCannedMessage.message);

    this.messageErrorMessage = retVal ? '' : 'Message cannot be blank.';
    this.setState({ messageError: !retVal });

    return retVal;
  }

  validTitle() {
    const retVal = !_.isEmpty(this.props.selectedCannedMessage.title);

    this.titleErrorMessage = retVal ? '' : 'Title cannot be blank.';
    this.setState({ titleError: !retVal });

    return retVal;
  }

  validFields() {
    const messageBool = this.validMessage();
    const titleBool = this.validTitle();

    return messageBool && titleBool;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validFields()) {
      return;
    }

    if (this.props.selectedCannedMessage.id === NewCannedMessage.get('id')) {
      this.props.onAddCannedMessage(this.props.selectedCannedMessage);
    } else {
      this.props.onEditCannedMessage(
        this.props.selectedCannedMessage,
        this.props.selectedCannedMessage.id
      );
    }
  }

  render() {
    return (
      <ModalWrapper
        modalTitle={this.props.modalTitle}
        okText={this.props.okText}
        onOk={this.handleSubmit}
      >
        <form onSubmit={this.handleSubmit}>
          <div
            className={`
              form-group
              ${this.state.titleError ? 'has-danger' : ''}
            `}
          >
            <label>Title</label>
            <input
              className="form-control form-control-danger"
              type="text"
              value={this.props.selectedCannedMessage.title}
              onChange={(e) => {
                this.handleChange('title', e.target.value);
              }}
            />
            <span className="form-control-feedback">{this.titleErrorMessage}</span>
          </div>
          <div
            className={`
              form-group
              ${this.state.messageError ? 'has-danger' : ''}
            `}
          >
            <label>Message</label>
            <textarea
              className="form-control form-control-danger text-box"
              type="text"
              value={this.props.selectedCannedMessage.message}
              onChange={(e) => {
                this.handleChange('message', e.target.value);
              }}
              ref={t => { this.textarea = t; }}
            />
            <span className="form-control-feedback">{this.messageErrorMessage}</span>
          </div>
          <div className="form-group">
            <label>Type</label>
            <div>
              <select
                className="custom-select"
                value={this.props.selectedCannedMessage.type}
                onChange={e => this.handleChange('type', e.target.value)}
              >
                <option value={CannedMessageType.TEMPLATE}>Template</option>
                <option value={CannedMessageType.ON_UNVERIFIED_CONTACT}>Auto reply</option>
              </select>
            </div>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={this.props.selectedCannedMessage.active}
                onChange={(e) => {
                  this.handleChange('active', e.target.checked);
                }}
              />
              <div>Active</div>
            </label>
          </div>
        </form>
      </ModalWrapper>
    );
  }
}

CannedMessageModal.propTypes = {
  onAddCannedMessage: React.PropTypes.func,
  onEditCannedMessage: React.PropTypes.func,
  onUpdateCannedMessage: React.PropTypes.func,
  title: React.PropTypes.string,
  message: React.PropTypes.string,
  active: React.PropTypes.bool,
  okText: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  selectedCannedMessage: React.PropTypes.object,
  items: React.PropTypes.array,
};

export default connect(
  state => ({
    selectedCannedMessage: state.getIn(['cannedMessages', 'selected']).toJS(),
    items: state.getIn(['cannedMessages', 'items']).toJS(),
  }),
  dispatch => ({
    onAddCannedMessage: (cannedMessage) => {
      dispatch(actions.createCannedMessage(cannedMessage));
      dispatch(actions.hideModal());
    },
    onEditCannedMessage: (cannedMessage, id) => {
      dispatch(actions.updateCannedMessage(cannedMessage, id));
      dispatch(actions.hideModal());
    },
    onUpdateCannedMessage: (cannedMessage) => {
      dispatch(actions.updateSelectedCannedMessage(cannedMessage));
    },
  })
)(CannedMessageModal);
