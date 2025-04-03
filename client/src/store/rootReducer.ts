import { combineSlices } from '@reduxjs/toolkit'
import authApi from '../api/authApi'

const rootReducer = combineSlices(authApi)

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
