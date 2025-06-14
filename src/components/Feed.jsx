import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';

const Feed = () => {
  const dispatch=useDispatch();
  const feed=useSelector(store=>store.feed);
  useEffect(()=>{
    getFeed();
  },[])
  const getFeed=async()=>{
    try{
      const res=await axios.get(BASE_URL + "/feed",{
        withCredentials:true
      });
      console.log("response"+JSON.stringify(res?.data?.data));
      
      dispatch(addFeed(res?.data?.data));
    }
    catch(err)
    {
      console.log(err);      
    }
  }
  return (
    feed && (<div className="flex justify-center my-10">
      <UserCard user={feed[0]}/>
    </div>
    )
  );
}

export default Feed;