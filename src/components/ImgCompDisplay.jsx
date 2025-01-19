import React from 'react'
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import {useNavigate,useLocation} from "react-router-dom";
import Favorite from "./Favorite";
import {
    emptyPhotos,
    chosenPhotoReducer,
  } from "../features/Photos/PhotosSlice";

function ImgCompDisplay({ele}) {
    const navigate=useNavigate();
    const dispatch = useDispatchHook();
    const location = useLocation();
    const viewerIsOwner = location.state;
    const {userId}=useSelectorHook('User');
    const handleClick=()=>
    {
      sessionStorage.setItem('imgDisplayData',JSON.stringify({
        photoInfo: ele,
        viewerIsOwner,
      }));
      navigate(`/user/image`, {
        state: {
          photoInfo: ele,
          viewerIsOwner,
        },
      });
      dispatch(chosenPhotoReducer(ele));
    }
  return (
    <div
    key={ele._id}
    className="p-2 w-full aspect-square drop-shadow-2xl relative"
   
  >
    <img
     onClick={handleClick}
      src={ele.imgURL}
      className="w-full select-none h-full rounded-2xl object-cover  cursor-pointer "
    />
    <Favorite userId={userId} ele={ele}/>
  </div>
  )
}

export default ImgCompDisplay;


