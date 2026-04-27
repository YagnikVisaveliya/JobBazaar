// import React from 'react'
import './index.css'
// import ReactDOM from 'react-dom/client'
// import App from './App.jsx'
// import { Toaster } from './components/ui/sonner.jsx'
// import { Provider } from 'react-redux'
// import store from './redux/store.js'

// // import { persistStore } from 'redux-persist'
// // import { PersistGate } from 'redux-persist/integration/react'

// // const persistor = persistStore(store);
// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <App />
//     </Provider>
//     <Toaster />
//   </React.StrictMode>,
// )


import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import axios from "axios";
import App from "./App.jsx";
import { Toaster } from "./components/ui/sonner.jsx";
import { store, persistor } from "./redux/store.js";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
    <Toaster />
  </React.StrictMode>
);
