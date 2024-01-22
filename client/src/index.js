import React, { StrictMode } from 'react';
import ReactDom from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import Store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import './main.css';

Modal.setAppElement('#root');

const root = ReactDom.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </StrictMode>
);
