// import { combineReducers, configureStore } from "@reduxjs/toolkit";
// import authSlice from "./authSlice";
// import jobSlice from "./jobSlice";
// import {
//     persistStore,
//     persistReducer,
//     FLUSH,
//     REHYDRATE,
//     PAUSE,
//     PERSIST,
//     PURGE,
//     REGISTER,
// } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import companySlice from "./companySlice";
// // import applicationSlice from "./applicationSlice";

// const persistConfig = {
//     key: 'root',
//     version: 1,
//     storage,
// }

// const rootReducer = combineReducers({
//     auth:authSlice,
//     job:jobSlice,
//     company:companySlice,
//     // application:applicationSlice
// })

// const persistedReducer = persistReducer(persistConfig, rootReducer)


// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }),
// });
// export default store;

// import { configureStore } from "@reduxjs/toolkit";
// import authSlice from "./authSlice";
// import jobSlice from "./jobSlice";
// import companySlice from "./companySlice";

// const store = configureStore({
//     reducer: {
//         auth: authSlice,  
//         job: jobSlice,
//         company: companySlice,
//     },
//   });
//   export default store;

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { createMigrate } from "redux-persist";
import storage from "redux-persist/lib/storage";  // uses localStorage for web
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import companySlice from "./companySlice";
import applicationsSlice from "./applications";

const rootReducer = combineReducers({
  auth: authSlice,
  job: jobSlice,
  company: companySlice,
  application: applicationsSlice
});

const removeSensitiveUserFields = (state) => {
  if (!state?.auth?.user || typeof state.auth.user !== "object") {
    return state;
  }

  const { password, refreshToken, ...safeUser } = state.auth.user;
  return {
    ...state,
    auth: {
      ...state.auth,
      user: safeUser,
    },
  };
};

const migrations = {
  2: (state) => removeSensitiveUserFields(state),
};

// Configuration for persistence
const persistConfig = {
  key: "root",         // key in storage
  version: 2,
  storage,             // storage engine (localStorage)
  migrate: createMigrate(migrations, { debug: false }),
//   whitelist: ["auth", "company"] // which slices you want to persist
  // you can also opt for `blacklist` to exclude slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ignore redux-persist action types for serializability warnings
        ignoredActions: [
          "persist/PERSIST",
          "persist/FLUSH",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

const persistor = persistStore(store);

export { store, persistor };
export default store;
