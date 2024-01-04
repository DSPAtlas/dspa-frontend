import React from 'react';
import { createRoot } from 'react-dom';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; 

// This file serves as the entry point of your React application.
// It is responsible for rendering the root component (in this case, App) into the DOM.
// It sets up the root element (usually an HTML element with an id of 'root') where the React app will be mounted.

const root = createRoot(document.getElementById('root'));
// const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



// entry point of app 
// 
