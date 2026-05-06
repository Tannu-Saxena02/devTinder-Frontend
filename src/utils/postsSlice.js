import { createSlice } from '@reduxjs/toolkit'
const postsSlice=createSlice({
    name:"posts",
    initialState: null, // ✅ CORRECT

    reducers:{
        addPosts:(state,action)=>action.payload,
        removeUserFromPosts:(state,action)=>{
             const newArray = state.filter((r) => r._id !== action.payload);
             return newArray;
        }
    }
})

export const  {addPosts,removeUserFromPosts}=postsSlice.actions;
export default postsSlice.reducer;