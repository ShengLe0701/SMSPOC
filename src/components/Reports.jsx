import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Seq } from 'immutable';

function Reports(props) {
  const listView = props.reports
    .map(report => (
      <Link
        to={`/app/reports/${report.get('id')}`}
        className={
          `list-group-item list-group-item-action flex-column align-items-start
           ${report.get('id') === props.params.reportId ? 'active' : ''}
           ${report.get('isDisabled') ? 'disabled' : ''}
          `
        }
        onClick={e => {
          if (report.get('isDisabled')) {
            e.preventDefault();
          }
        }}
        key={`report-nav-${report.get('id')}`}
      >
        <h6>{report.get('name')}</h6>
        <small>{report.get('description')}</small>
      </Link>
    ))
    .toJS();

  return (
    <div className="Reports">
      <div className="Reports-nav">
        <div className="list-group">
          {listView}
        </div>
      </div>
      {props.children}
    </div>
  );
}

Reports.propTypes = {
  reports: React.PropTypes.instanceOf(Seq),
  params: React.PropTypes.object,
  children: React.PropTypes.element,
};

export default connect(
  state => ({
    reports: state.getIn(['reports', 'items']).valueSeq(),
  }),
  () => ({})
)(Reports);
