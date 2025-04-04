import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import rootReducer, { RootState } from './rootReducer'
import authApi from '../api/authApi'
import userApi from '../api/userApi'

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(authApi.middleware, userApi.middleware),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export default store
