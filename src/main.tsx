import React from 'react';
import ReactDOM from 'react-dom';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ReactGA from 'react-ga4';
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';

LogRocket.init('lfmx6j/arkansas-qso-party');
setupLogRocketReact(LogRocket);

const isDev = false;
// const isDev = import.meta.env.DEV;
const TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID;
ReactGA.initialize(TRACKING_ID, { testMode: isDev });

LogRocket.getSessionURL(function (sessionURL) {
  ReactGA.send({
    hitType: 'event',
    eventCategory: 'LogRocket',
    eventAction: sessionURL
  });
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
