import React from 'react';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import Datetime from 'react-datetime';
import _ from 'lodash';

import * as actions from 'actions';
import { JobType, ScheduledJob } from 'constants';
import ModalWrapper from 'components/ModalWrapper';

class ScheduleMessageModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dateError: false,
      deliveryMethod: ScheduledJob.SMS,
      payload: {
        guestId: props.guest.get('id'),
        body: props.cannedMessageList.first().get('message'),
        from: props.phoneFrom,
        to: props.guest.get('phone'),
      },
      scheduledAt: '',
      type: JobType.SMS,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  validDate() {
    const retVal = this.state.scheduledAt.length > 0;
    this.setState({ dateError: !retVal });

    return retVal;
  }

  validFields() {
    const dateBool = this.validDate();

    return dateBool;
  }

  handleChange(event) {
    this.setState({ payload: {
      guestId: this.props.guest.get('id'),
      to: this.props.guest.get('phone'),
      from: this.props.phoneFrom,
      body: event.target.value,
    } });
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validFields()) return;

    const jobData = {};

    _.merge(jobData, this.state);
    delete(jobData.dateError);

    this.props.onScheduleMessage(jobData);
  }

  handleDate(_this, key, dateTime) {
    const temp = {};
    temp[key] = dateTime.toJSON();
    _this.setState(temp);
  }

  render() {
    const cannedMessageListView = this.props.cannedMessageList
    .map(cannedMessage => (
      <option
        key={`cannedMessage-${cannedMessage.get('id')}`}
        className=""
        value={cannedMessage.get('message')}
      >
        {cannedMessage.get('title')}
      </option>
    ));

    return (
      <ModalWrapper
        modalTitle="Schedule Message"
        okText="Schedule"
        onOk={this.handleSubmit}
      >
        <div className="ScheduleMessageModal">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label>Message Template</label><br />
              <select
                value={this.state.payload.message}
                className="custom-select"
                onChange={this.handleChange}
              >
                {cannedMessageListView}
              </select>
            </div>
            <div className="form-group">
              <label>Scheduled Date and Time</label>
              <Datetime
                inputProps={{ required: true }}
                onChange={value => this.handleDate(this, 'scheduledAt', value)}
              />
            </div>
          </form>
        </div>
      </ModalWrapper>
    );
  }
}

ScheduleMessageModal.propTypes = {
  cannedMessageList: React.PropTypes.instanceOf(List),
  guest: React.PropTypes.instanceOf(Map),
  phoneFrom: React.PropTypes.string,
  user: React.PropTypes.instanceOf(Map),
  onScheduleMessage: React.PropTypes.func,
};

export default connect(
  state => ({
    cannedMessageList: state.getIn(['cannedMessages', 'items'])
      .filter(cannedMessage => cannedMessage.get('active')),
    guest: state.getIn(['guests', 'items', state.getIn(['guests', 'selectedId'])], null),
    phoneFrom: state.getIn(['account', 'phone'], null),
    user: state.getIn(['auth', 'user']),
  }),
  dispatch => ({
    onScheduleMessage: job => {
      dispatch(actions.createJob(job));
      dispatch(actions.hideModal());
    },
  })
)(ScheduleMessageModal);
