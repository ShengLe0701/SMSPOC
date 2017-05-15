import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

import GenericWebNotification from 'components/GenericWebNotification';
import ModalContainer from 'components/ModalContainer';

export default function RootComponent(props) {
  return (
    <Provider store={store}>
      <div>
        {props.children}
        <div id="web-notification">
          <GenericWebNotification />
        </div>
        <ModalContainer />
      </div>
    </Provider>
  );
}

RootComponent.propTypes = {
  children: React.PropTypes.element.isRequired,
};
