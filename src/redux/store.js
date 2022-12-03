import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { collapsedReducer } from "./reducer/CollapsedReducer";
import { loadingdReducer } from "./reducer/LoadingReducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import thunk from "redux-thunk";

const persistConfig = {
  key: "xwq",
  storage,
   blacklist: ['loading'],
  middleware: [thunk],
};
const rootReducer = combineReducers({
  collapsed: collapsedReducer,
  loading: loadingdReducer,
});
  
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});


//   persistedReducer ，这是一个具有配置的增强型减速器，可将userReducer 的状态持久化到本地存储。除了本地存储，我们还可以使用其他存储引擎，如 [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)和Redux Persist Cookie存储适配器。

//


export const persistor = persistStore(store);