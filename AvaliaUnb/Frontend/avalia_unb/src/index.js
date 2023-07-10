import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {createStore, combineReducers} from 'redux';
import { Provider } from 'react-redux'
import sessionReducer from './StateManagement/Reducers/sessionReducer'
import messageDisplayReducer from './StateManagement/Reducers/messageDisplayReducer'

const reducer = combineReducers({
  session: sessionReducer,
  messageDisplay: messageDisplayReducer
});
const store = createStore(reducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
