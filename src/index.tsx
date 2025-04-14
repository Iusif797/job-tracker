import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './i18n/i18n';

console.log('Starting application initialization...');

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Failed to find the root element');
  throw new Error('Failed to find the root element');
}

console.log('Root element found, creating React root...');

const root = ReactDOM.createRoot(rootElement);

console.log('Rendering application...');

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('Application rendered successfully');

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
