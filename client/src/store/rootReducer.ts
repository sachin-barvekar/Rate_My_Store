import { combineSlices } from '@reduxjs/toolkit'
import authApi from '../api/authApi'
import userApi from '../api/userApi'
import dashboardApi from '../api/dashboardApi'
import storeApi from '../api/storeApi'

const rootReducer = combineSlices(authApi, userApi, dashboardApi, storeApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
