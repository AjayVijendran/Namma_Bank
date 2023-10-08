import { createSlice } from "@reduxjs/toolkit";
const initialState= {
    accInfo : null
}
const accSlice = createSlice({
    name: "acc",
    initialState,
    reducers : {
        addAccData : (state,action)=>{
            state.accInfo = action.payload
        }
    }
})
export const {addAccData} = accSlice.actions
export default accSlice.reducer