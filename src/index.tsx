import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Web3Provider } from 'src/contexts/web3.context';
import { SwapProvider } from "src/contexts/swap.context";
import { NotifierContextProvider } from 'react-headless-notifier';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <NotifierContextProvider
      config={{
        max: null,
        duration: 5000,
        position: 'topRight'
      }}
    >
      <Web3Provider>
        <SwapProvider>
          <App />
        </SwapProvider>
      </Web3Provider>
    </NotifierContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
