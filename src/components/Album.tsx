import { useLayoutEffect, useState, useEffect } from "react";
import UploadImages from "../components/uploadImages";
import UpdateAlbum from "../components/UpdateAlbum";
import useSelectorHook from "../customHooks/useSelectorHook";
import { Button } from "@material-tailwind/react";
import useDispatchHook from "../customHooks/useDispatchHook";
import useDebounce from "../customHooks/useDebounce";

import {
  setDeletedAlbumFalse,
  deleteAlbum,
} from "../features/Album/albumSlice";
import { filteredPhotosArrFB } from "../features/Photos/PhotosSlice";
import { Select, Option, Input } from "@material-tailwind/react";

import ImgCompDisplay from "./ImgCompDisplay";

import { emptyPhotos } from "../features/Photos/PhotosSlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
function Album() {
  const navigate = useNavigate();
  const location = useLocation();
  const viewerIsOwner =
    location?.state || JSON.parse(sessionStorage.getItem(`viewerIsOwner`));
  const { PhotosArr, filteredPhotosArr, status, tags } =
    useSelectorHook("Photos");
  const { deletedAlbum } = useSelectorHook("Album");
  const [deleteButton, setDeleteButton] = useState(false);

  const [search, setSearch] = useState("");

  const [tag, setTag] = useState("");
  const dispatch = useDispatchHook();
  const { albumid } = useParams();
  const deleteHandler = () => {
    setDeleteButton(true);
    dispatch(deleteAlbum(albumid));
  };
  const callBackToFilter = (val) => {
    dispatch(filteredPhotosArrFB(val.trim()));
  };

  const debouncedSearchValue = useDebounce(search, callBackToFilter, 500);

  useLayoutEffect(() => {
    dispatch(setDeletedAlbumFalse());
  }, [dispatch]);

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
  }, [deletedAlbum, deleteButton, navigate, dispatch]);

  return (
    <div className="mt-[100px]">
      <div className="mt-[120px] mb-[50px] flex flex-wrap gap-[30px] justify-center">
        <div style={{ width: "250px" }}>
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
        <div style={{ width: "250px" }}>
          <Input
            label="Search"
            value={search}
            type="text"
            onChange={(e) => setSearch(e.target.value)}
            crossOrigin={undefined}
          />
        </div>
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
          {/* {tag == ""
            ? PhotosArr.map((ele) => (
                <ImgCompDisplay ele={ele} />
              ))
            : PhotosArr.filter((ele) => ele.tags.includes(tag)).map((ele) => (
                <ImgCompDisplay ele={ele} />
              ))} */}

          {/*  NO tag , YES search */}
          {tag == "" &&
            debouncedSearchValue != "" &&
            filteredPhotosArr.map((ele) => <ImgCompDisplay ele={ele} />)}

          {/*  YES tag , NO search */}
          {tag != "" &&
            debouncedSearchValue == "" &&
            PhotosArr.filter((ele) => ele.tags.includes(tag)).map((ele) => (
              <ImgCompDisplay ele={ele} />
            ))}

          {/*  NO tag , NO search */}
          {(tag == "" || tag == "All Images") &&
            debouncedSearchValue == "" &&
            PhotosArr.map((ele) => <ImgCompDisplay ele={ele} />)}

          {/*  YES tag , YES search */}
          {tag != "" &&
            debouncedSearchValue != "" &&
            filteredPhotosArr
              .filter((ele) => ele.tags.includes(tag))
              .map((ele) => <ImgCompDisplay ele={ele} />)}
        </div>
      )}
    </div>
  );
}

export default Album;
