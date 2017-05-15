import React from 'react';
import { connect } from 'react-redux';

import { ModalType, ChatType } from 'constants.js';
import CannedMessageModal from 'components/CannedMessageModal';
import ContactSearchModal from 'components/ContactSearchModal';
import CreateGuestModal from 'components/CreateGuestModal';
import DeleteCannedMessageModal from 'components/DeleteCannedMessageModal';
import EditGuestInfoModal from 'components/EditGuestInfoModal';
import NotImplementedModal from 'components/NotImplementedModal';
import ScheduleMessageModal from 'components/ScheduleMessageModal';
import UserModal from 'components/UserModal';
import CallModal from 'components/CallModal';

const ModalConductor = props => {
  switch (props.modal) {
    case ModalType.CREATE_CANNED_MESSAGE:
      return (
        <CannedMessageModal
          modalTitle="New Message Template"
          okText="Create"
          {...props}
        />
      );
    case ModalType.EDIT_CANNED_MESSAGE:
      return (
        <CannedMessageModal
          modalTitle="Edit Message Templates"
          okText="Update"
          {...props}
        />
      );
    case ModalType.EDIT_GUEST_INFO:
      return <EditGuestInfoModal />;
    case ModalType.CREATE_USER:
      return (
        <UserModal
          modalTitle="New User"
          okText="Create"
        />
      );
    case ModalType.EDIT_USER:
      return (
        <UserModal
          modalTitle="Edit User"
          okText="Update"
          {...props}
        />
      );
    case ModalType.CREATE_GUEST_INFO:
      return (
        <CreateGuestModal {...props} />
      );
    case ModalType.SEARCH_USER:
      return <ContactSearchModal chatType={ChatType.USER} />;
    case ModalType.SEARCH_GUEST:
      return <ContactSearchModal chatType={ChatType.GUEST} />;
    case ModalType.DELETE_CANNED_MESSAGE:
      return (
        <DeleteCannedMessageModal
          modalTitle="Delete Message Template"
          okText="Delete Forever"
        />
      );
    case ModalType.NOT_IMPLEMENTED:
      return (
        <NotImplementedModal
          modalTitle="Not Implemented"
        />
      );
    case ModalType.SCHEDULE_MESSAGE:
      return <ScheduleMessageModal />;
    case ModalType.CALL_GUEST:
      return <CallModal />;
    default:
      return null;
  }
};

ModalConductor.propTypes = {
  modal: React.PropTypes.string,
};

export default connect(
  state => ({
    modal: state.get('modal'),
  }),
  () => ({})
)(ModalConductor);
