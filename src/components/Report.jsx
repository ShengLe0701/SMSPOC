import React from 'react';
import { connect } from 'react-redux';
import { Map, fromJS } from 'immutable';
import C3Chart from 'react-c3js';
import colorjs from 'color';
import moment from 'moment';

import color from 'style/color';

class Report extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    if (!this.props.report) {
      return <div />;
    }

    const report = this.props.report.delete('chart').toJS();
    const data = this.props.report
      .get('chart')
      .merge(fromJS({
        x: 'time',
        types: {
          count: 'bar',
        },
        names: {
          count: '# of messages',
        },
        labels: true,
        color: (c, d) => {
          if (d === 'count' || d.value <= 0) {
            return color.grayDark;
          }

          return colorjs(color.primary).mix(colorjs('red'), report.heat[d.index]).string();
        },
      }))
      .toJS();

    return (
      <div className="Report">
        <h1 className="mb-4">{report.name}</h1>
        <div className="Report-keywords">
          Keywords:
          {
            this.props.report.get('keywords').map(keyword => (
              <span key={`keyword-${keyword}`} className="badge badge-primary">
                {keyword}
              </span>
            )).toJS()
          }
        </div>
        <div className="Report-dates">
          From:
          <span className="Report-dates-date badge badge-default">
            {moment(report.startAt).format('dddd, MMMM Do YYYY')}
          </span>
          To:
          <span className="Report-dates-date badge badge-default">
            {moment(report.endAt).format('dddd, MMMM Do YYYY')}
          </span>
        </div>
        <C3Chart
          transition={{ duration: null }}
          data={data}
          axis={{
            x: {
              type: 'timeseries',
              tick: {
                format: '%m/%d',
              },
            },
          }}
        />
        <h4 className="mb-4">Messages</h4>
        {
          this.props.report.get('messages').map(message => (
            <div className="Report-message" key={`report-message-${message.get('createdAt')}`}>
              <div className="Report-message-sentiment">
                {
                  Math.random() < 0.5 ? (
                    <i className="text-danger fa fa-frown-o" />
                  ) : (
                    <i className="text-primary fa fa-smile-o" />
                  )
                }
              </div>
              <div className="Report-message-date">
                {moment(message.get('createdAt')).format('MMMM Do YYYY')}
              </div>
              <div className="Report-message-body">
                {message.get('body')}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

Report.propTypes = {
  report: React.PropTypes.instanceOf(Map),
};

export default connect(
  (state, props) => ({
    report: state.getIn(['reports', 'items', props.params.reportId]),
  }),
  () => ({
  })
)(Report);
