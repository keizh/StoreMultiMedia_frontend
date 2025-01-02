import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import useSelectorHook from "../customHooks/useSelectorHook";
import useDispatchHook from "../customHooks/useDispatchHook";
import { createAlbum } from "../features/Album/albumSlice";
export default function CreateAlbum() {
  const init = { name: "", description: "" };
  const [open, setOpen] = useState<boolean>(false);
  const [canClick, setCanClick] = useState<boolean>(false);
  const [data, setData] = useState(init);
  const [duplicateName, setDuplicateName] = useState("");
  const { OwnerAlbums } = useSelectorHook("Album");
  const dispatch = useDispatchHook();
  const handleOpen = () => setOpen(!open);
  const { userId } = useSelectorHook("User");

  useEffect(() => {
    if (data.name.trim() != "" && data.description.trim() != "") {
      setCanClick(true);
    } else if (data.name.trim() == "" || data.description.trim() == "") {
      setCanClick(false);
    }
  }, [data]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const listOfName: string[] = OwnerAlbums.map((ele) => ele.name);
    if (listOfName.includes(data.name.trim())) {
      setDuplicateName(`${data.name.trim()} already exists`);
    } else {
      console.log(`working`);
      dispatch(createAlbum({ ...data, ownerId: userId }));
      setData(init);
      setDuplicateName("");
      setOpen((open) => !open);
    }
  };

  return (
    <>
      <Button onClick={handleOpen} size="sm" variant="gradient" color="green">
        Create Album
      </Button>
      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader>Create a New Album</DialogHeader>
        <DialogBody>
          <form onSubmit={submitHandler} className="py-2 flex flex-col gap-5">
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
              label="name"
            />
            {duplicateName != "" && (
              <Typography
                color="red"
                variant="paragraph"
                className="-mt-5 ml-3"
              >
                {duplicateName}
              </Typography>
            )}
            <Textarea
              value={data.description}
              onChange={(e) =>
                setData((data) => ({
                  ...data,
                  [e.target.name]: e.target.value,
                }))
              }
              label="description"
              name="description"
            />
            <Button
              variant="filled"
              disabled={canClick ? false : true}
              color={canClick ? "green" : "red"}
              type="submit"
              className="mr-1"
            >
              <span>Create Album</span>
            </Button>
          </form>
        </DialogBody>
      </Dialog>
    </>
  );
}
