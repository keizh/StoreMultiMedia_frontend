import { useState, useEffect } from "react";
import ChipDismissible from "../components/chipTag";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Typography,
} from "@material-tailwind/react";

import useDispatchHook from "../customHooks/useDispatchHook";
import { postPhotos } from "../features/Photos/PhotosSlice";
import { useParams } from "react-router-dom";
import uniqid from "uniqid";

export default function UploadImages() {
  const [tagRef, setTagRef] = useState("");
  const init = { name: "", tags: [], images: [] };

  const [open, setOpen] = useState(false);
  const [canClick, setCanClick] = useState(false);
  const [data, setData] = useState(init);
  // const { PhotosArr } = useSelectorHook("Photos");
  const dispatch = useDispatchHook();
  const handleOpen = () => setOpen(!open);
  // const { userId } = useSelectorHook("User");
  const { albumid } = useParams();
  console.log(`albumID -->`, albumid);
  useEffect(() => {
    // Additional logic can be added if needed
  }, [data]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const imageArray = Array.from(files);
    setData((data) => {
      // each file should be less than 2 mb
      const filteredFiles = imageArray.filter(
        (ele) => ele.size < 2 * 1024 * 1024 && ele.type.split("/")[0] == "image"
      );
      return {
        ...data,
        images: filteredFiles.slice(0, 5),
      };
    });
    console.log(imageArray);
  };

  const handleAdd = () => {
    if (tagRef.trim()) {
      setData((data) => {
        const existingTags = data.tags.map((ele) =>
          ele.value.trim().toUpperCase()
        );

        if (existingTags.includes(tagRef.trim().toUpperCase())) {
          return data;
        }

        return {
          ...data,
          tags: [
            ...data.tags,
            { value: tagRef.trim().toUpperCase(), id: uniqid() },
          ],
        };
      });
      setTagRef("");
    }
  };

  useEffect(() => {
    if (
      data.images.length > 0 &&
      data.tags.length > 0 &&
      data.name.length > 0
    ) {
      setCanClick(true);
    } else {
      setCanClick(false);
    }
  }, [data]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    const tags = data.tags.map((ele) => ele.value);
    const images = data.images;
    const name = data.name;
    formdata.append("tags", JSON.stringify(tags));
    formdata.append("name", name);
    formdata.append("albumId", albumid);
    // images.forEach((ele) => {
    //   formdata.append(`images`, ele);
    // });

    // dispatching 1 image each time , why ? it is faster this way.
    images.forEach((img: File) => {
      formdata.append("images", img);
      dispatch(postPhotos(formdata));
      formdata.delete("images");
    });

    // for (let [k, v] of formdata.entries()) {
    //   console.log(k, `-->`, v);
    // }
    setOpen((open) => !open);
    setData(init);
  };

  return (
    <>
      <Button onClick={handleOpen} size="sm" variant="gradient" color="green">
        Upload Images
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Create a New Album</DialogHeader>
        <DialogBody>
          <form onSubmit={submitHandler} className="py-2 flex flex-col gap-5">
            {/* Image Input */}
            <div>
              <Typography variant="small">Select Images:</Typography>
              <input
                type="file"
                onChange={handleImages}
                name="images"
                multiple
              />
              <div className="p-2 bg-[#eeeee]">
                {data.images.length > 0 &&
                  data.images.map((ele, index) => (
                    <div className="text-black" key={index}>
                      {ele.name}
                    </div>
                  ))}
              </div>
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-mt-px h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                At Max 5 images
              </Typography>
              <Typography
                variant="small"
                color="gray"
                className="mt-2 flex items-center gap-1 font-normal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="-mt-px h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clipRule="evenodd"
                  />
                </svg>
                Max size of each image 1mb
              </Typography>
            </div>

            {/* Album Name Input */}
            <Input
              crossOrigin={undefined}
              value={data.name}
              onChange={(e) =>
                setData((data) => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }))
              }
              name="name"
              label="Name"
            />

            {/* Tag Input */}
            <div>
              <div className="rounded p-3 flex gap-2 flex-wrap bg-[#eeeeee]">
                {data.tags.length > 0 &&
                  data.tags.map((ele) => (
                    <ChipDismissible key={ele.id} ele={ele} setData={setData} />
                  ))}
              </div>
              <br />
              <div className="flex gap-2">
                <Input
                  crossOrigin={undefined}
                  label="Add Tag"
                  className="p-1 rounded"
                  onChange={(e) => setTagRef(e.target.value)}
                  value={tagRef}
                />
                <Button color="green" onClick={handleAdd}>
                  Add
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              variant="filled"
              disabled={!canClick}
              color={canClick ? "green" : "red"}
              type="submit"
              className="mr-1"
            >
              <span>upload Images</span>
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
