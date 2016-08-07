import React from "react"
import { render } from "react-dom"
import App from "./containers/app"
import LoginPage from "./components/login-page.js"
import HomePage from "./components/home-page.js"
import "normalize.css";
import "./components/global.css";
import {IndexRoute, Route, Router, browserHistory} from 'react-router';
import RecycleBin from './components/RecycleBin/RecycleBin.js';

import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import thunk from 'redux-thunk'

import reducer from './reducers/commonReducer'

const middleware = [ thunk ]

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

render(
    (<Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App}>
<<<<<<< HEAD
           <IndexRoute component={HomePage} />
=======
          <IndexRoute component={LoginPage} />
		  <Route path="recycle-bin" component={RecycleBin}/>
>>>>>>> 9ac8fca9bdeb027e683baf6cad77aa8c447f0f54
        </Route>
      </Router>
    </Provider>)
    , document.getElementById('root')
)
