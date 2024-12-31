// @ts-nocheck
import Select from "react-select";
import { useState, useEffect, useRef } from "react";
import ChipDismissible from "../components/chipTag";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Typography,
} from "@material-tailwind/react";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import { postPhotos } from "../features/Photos/PhotosSlice";
import { useParams } from "react-router-dom";
import uniqid from "uniqid";
import { updateAlbum } from "../features/Album/albumSlice";

export default function UploadAlbum() {
  const [albumData, setAlbumData] = useState(null);
  // const selectEmails = useRef([]);
  const [selectEmails, setSelectedEmails] = useState([]);
  const [listOfUser, setListOfUsers] = useState(null);
  const [open, setOpen] = useState(false);
  const [canClick, setCanClick] = useState(false);

  const dispatch = useDispatchHook();
  const handleOpen = () => setOpen(!open);
  const { userId, userList } = useSelectorHook("User");
  const { selectedAlbumData } = useSelectorHook("Album");
  const { albumid } = useParams();

  // USEFULL
  useEffect(() => {
    if (selectedAlbumData != null) {
      setAlbumData(selectedAlbumData);
      setSelectedEmails(
        selectedAlbumData?.sharedUsers.map((ele) => ({
          value: ele,
          label: ele,
        }))
      );
    }
  }, [selectedAlbumData, setAlbumData]);

  // USEFULL
  useEffect(() => {
    if (userList?.length > 0) {
      setListOfUsers(
        userList.map((ele) => ({ value: ele.email, label: ele.email }))
      );
    }
  }, [userList, setListOfUsers]);

  useEffect(() => {
    if (userList.length == 0) {
      if (
        albumData?.description != selectedAlbumData?.description &&
        selectedAlbumData?.description.length > 0
      ) {
        setCanClick(true);
        console.log(`canclick is true`);
      } else {
        setCanClick(false);
        console.log(`canclick is false`);
      }
    } else {
      if (
        (selectEmails.length >= 0 && albumData?.description.length > 0) ||
        (albumData?.description.length > 0 &&
          albumData?.description != selectedAlbumData?.description)
      ) {
        setCanClick(true);
        console.log(`canclick is true`);
      } else {
        setCanClick(false);
        console.log(`canclick is false`);
      }
    }
  }, [albumData, selectEmails]);

  const submitHandler = (e) => {
    e.preventDefault();
    // console.log(`albumData`, albumData);
    // console.log(`selectEmails`, selectEmails);
    const data = {
      sharedUsers: selectEmails,
      description: albumData.description,
    };
    // console.log(data);
    // console.log(albumid);
    dispatch(updateAlbum({ data, albumId: albumid }));
    setOpen((open) => !open);
  };

  return (
    <>
      <Button onClick={handleOpen} size="sm" variant="gradient" color="yellow">
        SHARE & UPDATE
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>UPDATE ALBUM</DialogHeader>
        <DialogBody>
          <form onSubmit={submitHandler} className="-mt-6 flex flex-col gap-5">
            {/* Image Input */}
            <div>
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                Album Name
              </Typography>
              <Input
                label="Album Name"
                disabled={true}
                value={albumData?.name ?? ""}
              />
            </div>

            <Input
              value={albumData?.description ?? ""}
              onChange={(e) =>
                setAlbumData((albumData) => ({
                  ...albumData,
                  description: e.target.value,
                }))
              }
              name="description"
              label="description"
            />

            {/* Tag Input */}
            <div>
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                Shared With
              </Typography>
              {listOfUser?.length == 0 && <p>No Users to share it with</p>}
              {listOfUser?.length > 0 && (
                <Select
                  isMulti
                  defaultValue={selectEmails}
                  name="Shared Users"
                  options={listOfUser}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(val) =>
                    setSelectedEmails(val.map((ele) => ele.value))
                  }
                />
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="filled"
              disabled={!canClick}
              color={canClick ? "green" : "red"}
              type="submit"
              className="mr-1"
            >
              <span>Update Album</span>
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
