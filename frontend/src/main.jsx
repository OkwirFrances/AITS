import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import './main.css';

// Create a root with concurrent mode features
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to measure performance in your app
// if (process.env.NODE_ENV === 'development') {
//   reportWebVitals(console.log);
// }