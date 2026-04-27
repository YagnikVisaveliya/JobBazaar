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
import { SERVER_URL } from "./utils/constant";

axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const statusCode = error?.response?.status;
    const isRefreshCall = originalRequest?.url?.includes("/refresh-token");

    if (statusCode !== 401 || !originalRequest || originalRequest._retry || isRefreshCall) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const refreshResponse = await axios.post(
        `${SERVER_URL}/refresh-token`,
        { refreshToken },
        { withCredentials: true },
      );

      const newAccessToken = refreshResponse?.data?.data?.accessToken;
      const newRefreshToken = refreshResponse?.data?.data?.refreshToken;

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      localStorage.setItem("accessToken", newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      originalRequest.headers = originalRequest.headers || {};
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return axios(originalRequest);
    } catch (refreshError) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return Promise.reject(refreshError);
    }
  },
);

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
