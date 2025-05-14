// import './wdyr.js';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.js';
import { createBrowserHistory } from 'history';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import * as serviceWorker from './serviceWorker.js';
import reportWebVitals from './reportWebVitals.js';

const history = createBrowserHistory();

// Create a root for React 18
const root = ReactDOM.createRoot(document.getElementById('root'));

// Sentry configuration
process.env.NODE_ENV === "production" && Sentry.init({
  dsn: "https://496f7401c93d458ab3cf5e4632e7a923@o990278.ingest.sentry.io/6007465",
  integrations: [new Integrations.BrowserTracing({
    tracingOrigins: ["localhost", "www.hoseacodes.com", /^\//],
    routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
  })],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.01,
});

root.render(
// ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
