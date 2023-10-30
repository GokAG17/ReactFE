import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Disable SSL certificate validation globally
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
  </>
);
