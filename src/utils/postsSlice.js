import { createSlice } from '@reduxjs/toolkit'
const postsSlice=createSlice({
    name:"posts",
    initialState: null, // ✅ CORRECT

    reducers:{
        addPosts:(state,action)=>action.payload,
        appendPosts:(state, action) => [...(state || []), ...action.payload],
    }
})

export const  {addPosts, appendPosts}=postsSlice.actions;
export default postsSlice.reducer;
