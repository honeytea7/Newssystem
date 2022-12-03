import axios from 'axios'
import {store} from '../redux/store'
import{setLoading} from '../redux/reducer/LoadingReducer'
    // 请求拦截器
axios.defaults.baseURL = 'http://localhost:8000'

// axios.defaults.headers  

axios.interceptors.request.use(function (config) {
     store.dispatch(setLoading())
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
// 2.添加响应拦截器
axios.interceptors.response.use(function (response) {
     store.dispatch(setLoading());
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  })