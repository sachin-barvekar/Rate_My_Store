import { combineSlices } from '@reduxjs/toolkit'
import authApi from '../api/authApi'
import userApi from '../api/userApi'

const rootReducer = combineSlices(authApi, userApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
