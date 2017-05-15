import React from 'react';
import { Provider } from 'react-redux';

import Router from 'components/native/Router';
import store from 'store';
import * as actions from 'actions';

export default class App extends React.Component {
  componentDidMount() {
    store.dispatch(actions.init());
  }

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
