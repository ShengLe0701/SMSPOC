import React from 'react';
import { connect } from 'react-redux';

import ErrorMessage from 'components/ErrorMessage';
import * as actions from 'actions';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      emailError: false,
      passwordError: false,
    };
  }

  validEmail(email) {
    const retVal = (email.length > 0);
    this.setState({ emailError: !retVal });

    return retVal;
  }

  validPassword(password) {
    const retVal = (password.length > 0);
    this.setState({ passwordError: !retVal });

    return retVal;
  }

  validFields() {
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    return this.validEmail(email) && this.validPassword(password);
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.validFields()) {
      this.props.onLogin({
        email: this.emailInput.value.trim(),
        password: this.passwordInput.value,
      });
    }
  }

  render() {
    // TODO(ivan): Display login errors.
    return (
      <div className="LoginForm">
        <div className="Login-header">
          <h2>
            Log in
          </h2>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div
            className={`
              form-group
              ${this.state.emailError ? 'has-danger' : ''}
            `}
          >
            <label className="form-control-label">Email</label>
            <input
              className="form-control form-control-danger"
              type="text"
              ref={el => { this.emailInput = el; }}
            />
          </div>
          <div
            className={`
              form-group
              ${this.state.passwordError ? 'has-danger' : ''}
            `}
          >
            <label className="form-control-label">Password</label>
            <input
              className="form-control form-control-danger"
              type="password"
              ref={el => { this.passwordInput = el; }}
            />
          </div>
          <div>
            <button
              className="btn btn-success"
              type="submit"
            >
              Log in
            </button>
          </div>
        </form>
        <ErrorMessage />
      </div>
    );
  }
}

LoginForm.propTypes = {
  onLogin: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    onLogin: form => dispatch(actions.login(form)),
  })
)(LoginForm);
