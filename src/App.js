import React from 'react'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux'

import './util/http'
import './App.css'
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter />
      </PersistGate>
    </Provider>
  );
}

 
// .scss结尾就是  sass首先安装sass模块 npm i--save sass
/* 反向代理的配置
建议服务器
json-server --watch db.json                                                                                                                                                                                                                                                                                                                                                              
json-server --watch .\db.json --port 8000


*/