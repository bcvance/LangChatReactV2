import React from 'react';
import ReactDOM from 'react-dom/client';
import "bootswatch/dist/sandstone/bootstrap.min.css";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import UsersProvider from './contexts/UserProvider';
import ConversationsProvider from './contexts/ConversationsProvider'
import ContactsProvider from './contexts/ContactsProvider'
import { useEffect } from 'react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UsersProvider>
      <ConversationsProvider>
        <ContactsProvider>
          <App />
        </ContactsProvider>
      </ConversationsProvider>
    </UsersProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
