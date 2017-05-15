import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import ModalWrapper from 'components/ModalWrapper';
import * as actions from 'actions';
import { NewUser } from 'constants';

class UserModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordError: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validEmail() {
    const retVal = this.emailInput.value.length > 0;

    this.emailErrorMessage = retVal ? '' : 'Email cannot be blank.';
    this.setState({ emailError: !retVal });

    return retVal;
  }

  validName() {
    const retVal = this.nameInput.value.length > 0;

    this.nameErrorMessage = retVal ? '' : 'Name cannot be blank.';
    this.setState({ nameError: !retVal });

    return retVal;
  }

  validPassword() {
    const password = this.passwordInput ? this.passwordInput.value : '';
    const passwordConfirmation = this.passwordConfirmationInput ?
      this.passwordConfirmationInput.value : '';

    const passwordLength = (this.props.selectedUser.get('id') === NewUser.get('id')) ?
      password.length > 0 : true;

    const retVal = passwordLength && (password === passwordConfirmation);
    this.setState({ passwordError: !retVal });

    return retVal;
  }

  validFields() {
    const bPassword = this.validPassword();
    const bEmail = this.validEmail();
    const bName = this.validName();

    return bPassword && bEmail && bName;
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.validFields()) return;

    const userData = {
      name: this.nameInput.value,
      email: this.emailInput.value,
      password: this.passwordInput.value,
      isAdmin: this.isAdminInput.checked,
      isActive: this.isActiveInput.checked,
      phone: this.phoneInput.value,
    };

    if (this.props.selectedUser.get('id') === NewUser.get('id')) {
      this.props.onAddUser(userData);
    } else {
      if (userData.password.length === 0) delete(userData.password);

      this.props.onEditUser(_.merge(userData, { id: this.props.selectedUser.get('id') }));
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
              ${this.state.nameError ? 'has-danger' : ''}
            `}
          >
            <label>Name</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.selectedUser.get('name')}
              ref={el => { this.nameInput = el; }}
            />
            <span className="form-control-feedback">{this.nameErrorMessage}</span>
          </div>
          <div
            className={`
              form-group
              ${this.state.emailError ? 'has-danger' : ''}
            `}
          >
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.selectedUser.get('email')}
              ref={el => { this.emailInput = el; }}
            />
            <span className="form-control-feedback">{this.emailErrorMessage}</span>
          </div>
          <div className="form-group">
            <label>Call Forwarding Phone Number</label>
            <input
              className="form-control"
              type="text"
              defaultValue={this.props.selectedUser.get('phone')}
              ref={el => { this.phoneInput = el; }}
              placeholder="eg. +17895551212 (optional)"
            />
          </div>
          <div
            className={`
              form-group
              ${this.state.passwordError ? 'has-danger' : ''}
            `}
          >
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              ref={el => { this.passwordInput = el; }}
            />
          </div>
          <div
            className={`
              form-group
              ${this.state.passwordError ? 'has-danger' : ''}
            `}
          >
            <label>Password Confirmation</label>
            <input
              className="form-control"
              type="password"
              ref={el => { this.passwordConfirmationInput = el; }}
            />
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={this.props.selectedUser.get('isAdmin')}
                ref={el => { this.isAdminInput = el; }}
              />
              <div>Admin</div>
            </label>
          </div>
          <div className="form-check">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={this.props.selectedUser.get('isActive')}
                ref={el => { this.isActiveInput = el; }}
              />
              <div>Active</div>
            </label>
          </div>
        </form>
      </ModalWrapper>
    );
  }
}

UserModal.propTypes = {
  onAddUser: React.PropTypes.func,
  onEditUser: React.PropTypes.func,
  okText: React.PropTypes.string,
  modalTitle: React.PropTypes.string,
  selectedUser: React.PropTypes.object,
};

export default connect(
  state => ({
    selectedUser: state.getIn(['admin', 'selectedUser']),
  }),
  dispatch => ({
    onAddUser: (user) => {
      dispatch(actions.createUser(user));
      dispatch(actions.hideModal());
    },
    onEditUser: (user) => {
      dispatch(actions.updateUser(user));
      dispatch(actions.hideModal());
    },
  })
)(UserModal);
