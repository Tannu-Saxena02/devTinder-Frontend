import { createSlice } from '@reduxjs/toolkit'
const postsSlice=createSlice({
    name:"posts",
    initialState: null, // ✅ CORRECT

    reducers:{
        addPosts:(state,action)=>action.payload
    }
})

export const  {addPosts}=postsSlice.actions;
export default postsSlice.reducer;