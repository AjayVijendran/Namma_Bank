import { createSlice } from "@reduxjs/toolkit";
const initialState= {
    userInfo : null
}
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        updateData : (state,action)=>{
            state.userInfo = action.payload
        }
    }
})
export const {updateData} = userSlice.actions
export default userSlice.reducer