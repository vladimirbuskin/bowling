import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import bowlingApp from './reducers'
import App from './components/App'

import './styles.css'

let store = createStore(bowlingApp, window.devToolsExtension && window.devToolsExtension());


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);