import React from 'react';
import { Platform, ScrollView, View } from 'react-native';

import color from 'style/color';

export default class MessagesScrollView extends React.Component {
  constructor(props) {
    super(props);

    this.onLayout = this.onLayout.bind(this);
    this.onContentSizeChange = this.onContentSizeChange.bind(this);

    this.height = 0;
    this.contentHeight = 0;
  }

  onLayout({ nativeEvent: { layout: { height } } }) {
    this.height = height;
    this.checkAndScroll();
  }

  onContentSizeChange(width, height) {
    this.contentHeight = height;
    this.checkAndScroll();
  }

  checkAndScroll() {
    if (this.contentHeight > this.height) {
      this.scrollView.scrollToEnd({ animated: false });
    } else {
      this.scrollView.scrollTo({ x: 0, y: 0, animated: false });
    }
  }

  render() {
    return (
      <ScrollView
        style={{
          padding: 12,
          backgroundColor: color.white,
        }}
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'none'}
        ref={e => { this.scrollView = e; }}
        onContentSizeChange={this.onContentSizeChange}
        onLayout={this.onLayout}
      >
        {this.props.children}
        <View
          style={{
            height: Platform.OS === 'ios' ? 0 : 12,
          }}
        />
      </ScrollView>
    );
  }
}

MessagesScrollView.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
};
