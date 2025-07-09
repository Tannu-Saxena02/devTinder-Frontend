import axios from 'axios';
import React, { useEffect,useState } from 'react';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';
import Dialog from '../utils/Dialog';

const Feed = () => {
  const theme = useSelector((state) => state.theme);
  const dispatch=useDispatch();
  const feed=useSelector(store=>store.feed);
  const [dialog, setDialog] = useState({
      status: false,
      isOpen: false,
      title: "",
      message: "",
      onClose: null,
    });
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
       setDialog({
          status: false,
          isOpen: true,
          title: "Error",
          message: err?.data?.message,
          onClose: closeDialog,
        });
    }
  }
   const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };
  if (!feed) return;
  if (feed.length <= 0)
    return <h1 className="flex justify-center my-10"
     style={{color: theme === "dark" ? "#ffffff" : "black",fontWeight:"500"}}>No new users founds!</h1>;

  return (
    feed && (<div className="flex justify-center my-10">
      <UserCard user={feed[0]}/>
       {dialog.isOpen && (
        <Dialog
          status={dialog.status}
          isOpen={dialog.isOpen}
          title={dialog.title}
          message={dialog.message}
          onClose={dialog.onClose}
        />
      )}
    </div>
    )
  );
}

export default Feed;