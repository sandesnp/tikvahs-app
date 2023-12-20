import React, { StrictMode } from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';
import { Provider } from 'react-redux';
import Store from './redux/store';

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </StrictMode>
);
