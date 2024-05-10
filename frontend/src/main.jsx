import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {store, mypersistor} from './store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={mypersistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);