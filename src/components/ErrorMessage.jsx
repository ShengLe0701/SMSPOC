import React from 'react';
import { connect } from 'react-redux';

function ErrorMessage(props) {
  let value = '';
  if (props.error && props.error.response) {
    value = props.error.response.text;
  }

  return (
    <div className="Error">
      {value}
    </div>
  );
}

ErrorMessage.propTypes = {
  error: React.PropTypes.object,
};

export default connect(
  state => ({
    error: state.getIn(['auth', 'error']),
  }),
  () => ({})
)(ErrorMessage);
