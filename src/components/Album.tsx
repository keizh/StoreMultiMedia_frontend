import React, { useLayoutEffect, useState, useEffect } from "react";
import UploadImages from "../components/uploadImages";
import UpdateAlbum from "../components/UpdateAlbum";
import useSelectorHook from "../customHooks/useSelectorHook";
import { Button } from "@material-tailwind/react";
import useDispatchHook from "../customHooks/useDispatchHook";
import {
  setDeletedAlbumFalse,
  deleteAlbum,
} from "../features/Album/albumSlice";

import store from "../app/store";
import { emptyPhotos } from "../features/Photos/PhotosSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
function Album() {
  const navigate = useNavigate();
  const location = useLocation();
  const viewerIsOwner = location.state;
  const { PhotosArr, status } = useSelectorHook("Photos");
  const { deletedAlbum } = useSelectorHook("Album");
  const [deleteButton, setDeleteButton] = useState(false);
  const dispatch = useDispatchHook();
  const { albumid } = useParams();
  const deleteHandler = (e) => {
    setDeleteButton(true);
    // @ts-ignore
    dispatch(deleteAlbum(albumid));
  };

  useLayoutEffect(() => {
    dispatch(setDeletedAlbumFalse());
  }, []);
  // const deletedAlbum = store.getState().Album.deletedAlbum;
  useEffect(() => {
    console.log(
      " TAKE_1 ==> executing useEffect",
      `deleteButton : ${deleteButton} `,
      `deletedAlbum : ${deletedAlbum}`
    );
    if (deleteButton && deletedAlbum) {
      console.log(
        " TAKE_2 ==> executing useEffect",
        `deleteButton : ${deleteButton} `,
        `deletedAlbum : ${deletedAlbum}`
      );
      setDeleteButton(false);
      dispatch(emptyPhotos());
      navigate("/user/auth/photos");
    }
  }, [deletedAlbum, deleteButton, navigate]);

  return (
    <div className="mt-[100px]">
      {viewerIsOwner && (
        <div className="flex p-5 justify-end gap-2">
          <UploadImages />
          <UpdateAlbum />
          <Button
            loading={deleteButton}
            onClick={deleteHandler}
            size="sm"
            color="red"
          >
            Delete Album
          </Button>
        </div>
      )}
      {PhotosArr.length == 0 && status != "success" && <p>Loading</p>}
      {PhotosArr.length == 0 && status == "success" && <p>upload Images..</p>}
      {PhotosArr.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {PhotosArr.map((ele) => (
            <div
              key={ele._id}
              className="p-2 w-full aspect-square drop-shadow-2xl "
              onClick={() => {
                navigate(`/user/image`, {
                  state: {
                    photoInfo: ele,
                    viewerIsOwner,
                  },
                });
              }}
            >
              <img
                src={ele.imgURL}
                className="w-full select-none h-full rounded-2xl object-cover  cursor-pointer "
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Album;
