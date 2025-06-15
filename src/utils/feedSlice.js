import { createSlice } from '@reduxjs/toolkit'
const feedSlice=createSlice({
    name:"feed",
    initialState: null, // ✅ CORRECT

    reducers:{
        addFeed:(state,action)=>action.payload,
        removeUserFromFeed:(state,action)=>{
             const newArray = state.filter((r) => r._id !== action.payload);
             return newArray;
        }
    }
})

export const  {addFeed,removeUserFromFeed}=feedSlice.actions;
export default feedSlice.reducer;