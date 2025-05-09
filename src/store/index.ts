import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // 默认使用localStorage

// 导入reducers
import breadcrumbReducer from './slices/breadcrumbSlice';

// 持久化配置
const persistConfig = {
  key: 'root',
  storage,
  // 只持久化面包屑以便用户刷新页面后不丢失导航状态
  whitelist: ['breadcrumb'],
};

// 组合所有reducers
const rootReducer = combineReducers({
  breadcrumb: breadcrumbReducer,
  // 这里可以添加其他reducer
});

// 创建持久化reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 创建store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false, // 禁用可序列化检查，因为redux-persist有非序列化数据
    }),
});

// 创建持久化store
export const persistor = persistStore(store);

// 定义RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 定义类型化的hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
