import React from 'react';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import * as actions from 'actions';
import { ModalType, NewUser } from 'constants';
import Page from 'components/Page';

function prevent(actionFn, ...args) {
  return event => {
    event.preventDefault();
    actionFn(...args);
  };
}

function UserList(props) {
  const tableHeader = (
    <thead className="thead-default">
      <tr>
        <th>Name</th>
        <th>Active</th>
        <th>Actions</th>
      </tr>
    </thead>
  );

  const newUser = (
    <button
      className="btn btn-primary"
      onClick={props.onAddNewUser}
    >
      Add New User
    </button>
  );

  const userList = props.users.map(user => (
    <tr key={`user-${user.get('id')}`}>
      <td>{user.get('name')}</td>
      <td>{user.get('isActive') ? 'true' : 'false'}</td>
      <td>
        <a
          href="#"
          onClick={prevent(props.onShowModal, ModalType.EDIT_USER, user)}
        >
          <span className="align-middle">Edit</span>
        </a>
      </td>
    </tr>
  ));

  return (
    <Page>
      <div className="UserList">
        <h1 className="mb-4">Manage Users</h1>
        {newUser}
        <table className="UserList-table table table-bordered">
          {tableHeader}
          <tbody>
            {userList.toArray()}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

UserList.propTypes = {
  onAddNewUser: React.PropTypes.func,
  onShowModal: React.PropTypes.func,
  users: React.PropTypes.instanceOf(Map),
};

export default connect(
  state => ({
    users: state.getIn(['users', 'items']),
  }),
  dispatch => ({
    onShowModal: (modal, user) => {
      dispatch(actions.setSelectedUser(user));
      dispatch(actions.showModal(modal));
    },
    onAddNewUser: () => {
      dispatch(actions.setSelectedUser(NewUser));
      dispatch(actions.showModal(ModalType.CREATE_USER));
    },
  })
)(UserList);
