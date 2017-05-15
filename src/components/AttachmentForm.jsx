import React from 'react';

export default class AttachmentForm extends React.Component {
  render() {
    return (
      <div>
        <input
          type="file"
          ref={i => { this.fileInput = i; }}
          onChange={this.props.onFileSelect}
          className="MessageForm-attach-fileInput"
        />
        <button
          className="btn btn-secondary"
          title="Send a file"
          onClick={() => this.fileInput.click()}
        >
          <i className="fa fa-paperclip fa-lg" />
        </button>
      </div>
    );
  }
}

AttachmentForm.propTypes = {
  chatType: React.PropTypes.string,
  chatId: React.PropTypes.string,
  onFileSelect: React.PropTypes.func,
};
