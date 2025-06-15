import { createSlice } from '@reduxjs/toolkit'
const requestSlice=createSlice({
    name:"requests",
    initialState: null, // ✅ CORRECT

    reducers:{
        addRequests:(state,action)=>{
            return action.payload;
        },
        removeRequests:(state,action)=>{
          return null;
        }
    }
})

export const  {addRequests,removeRequests}=requestSlice.actions;
export default requestSlice.reducer;