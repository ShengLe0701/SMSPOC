import React from 'react';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import 'expose?jQuery!jquery';
import 'expose?Tether!tether';
import 'bootstrap';

import routes from 'routes';
import store from 'store';
import * as actions from 'actions';


store.dispatch(actions.init());

window.onload = () => {
  const node = document.getElementById('app');

  render(
    <Provider store={store}>
      <Router routes={routes} history={browserHistory} />
    </Provider>, node
  );
};

