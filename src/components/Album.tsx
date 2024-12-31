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
import { Select, Option } from "@material-tailwind/react";

import store from "../app/store";
import {
  emptyPhotos,
  chosenPhotoReducer,
} from "../features/Photos/PhotosSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
function Album() {
  const navigate = useNavigate();
  const location = useLocation();
  const viewerIsOwner = location.state;
  const { PhotosArr, status, tags } = useSelectorHook("Photos");
  const { deletedAlbum } = useSelectorHook("Album");
  const [deleteButton, setDeleteButton] = useState(false);
  const [tag, setTag] = useState("");
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
      <div className="min-w-[150px] w-[300px] mt-[100px]">
        <Select onChange={(val) => setTag(val)} label="Filter based on Tag">
          {tags.map((ele, idx) => {
            if (ele == "All Images") {
              return (
                <Option key={idx} value="">
                  {ele}
                </Option>
              );
            } else {
              return (
                <Option key={idx} value={ele}>
                  {ele}
                </Option>
              );
            }
          })}
        </Select>
      </div>
      {viewerIsOwner && (
        <div className="flex p-5 justify-end gap-2 ">
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
          {tag == ""
            ? PhotosArr.map((ele) => (
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
                    dispatch(chosenPhotoReducer(ele));
                  }}
                >
                  <img
                    src={ele.imgURL}
                    className="w-full select-none h-full rounded-2xl object-cover  cursor-pointer "
                  />
                </div>
              ))
            : PhotosArr.filter((ele) => ele.tags.includes(tag)).map((ele) => (
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
                    dispatch(chosenPhotoReducer(ele));
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
