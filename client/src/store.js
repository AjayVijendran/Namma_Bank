import {configureStore} from "@reduxjs/toolkit"
import userReducer from "./feature/userSlice"
import accReducer from "./feature/accSlice"
import { apiSlice } from "./feature/apiSlice"
export const store = configureStore({
    reducer : {
        user : userReducer,
        acc : accReducer,
        [apiSlice.reducerPath] : apiSlice.reducer
    }
})