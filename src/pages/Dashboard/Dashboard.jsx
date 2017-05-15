import React from 'react';
import { connect } from 'react-redux';

import * as actions from 'actions';
import { ModalType } from 'constants';
import { GuestsList, UsersList } from 'components/ContactList';
import Chat from 'components/Chat';
import GuestInfo from 'components/GuestInfo';

function Dashboard(props) {
  return (
    <div className="Dashboard">
      <div className="Dashboard-leftPane">
        <div className="Dashboard-leftPane-header">
          <button
            className="btn btn-primary Dashboard-leftPane-header-addGuest"
            onClick={props.showModal(ModalType.CREATE_GUEST_INFO)}
          >
            Add Guest
          </button>
        </div>
        <div className="Dashboard-leftPane-section">
          <div className="h4 Dashboard-leftPane-caption">
            <div>Guests</div>
            <div>
              <a href="#" onClick={props.showModal(ModalType.SEARCH_GUEST)}>
                <i className="fa fa-search" />
              </a>
            </div>
          </div>
          <GuestsList />
        </div>
        <div className="Dashboard-leftPane-section">
          <div className="h4 Dashboard-leftPane-caption">
            <div>Staff</div>
            <div>
              <a href="#" onClick={props.showModal(ModalType.SEARCH_USER)}>
                <i className="fa fa-search" />
              </a>
            </div>
          </div>
          <UsersList />
        </div>
      </div>
      <div className="Dashboard-middlePane">
        <Chat />
      </div>
      <div className="Dashboard-rightPane">
        <GuestInfo />
      </div>
    </div>
  );
}

Dashboard.propTypes = {
  showModal: React.PropTypes.func,
};

export default connect(
  () => ({}),
  dispatch => ({
    showModal: modal => event => {
      event.preventDefault();
      dispatch(actions.showModal(modal));
    },
  })
)(Dashboard);
