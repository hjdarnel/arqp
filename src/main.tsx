import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ReactGA from 'react-ga4';

const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
ReactGA.initialize(TRACKING_ID);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
