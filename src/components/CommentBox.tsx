import { Button, Input } from "@material-tailwind/react";
import React from "react";
import { motion } from "framer-motion";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import { addComment, removeComment } from "../features/Photos/PhotosSlice";

function CommentBox({ imageId }) {
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("User");
  const { chosenPhoto } = useSelectorHook("Photos");
  //   const specificPhoto = PhotosArr.filter((ele) => ele.imageId == imageId);
  //   const { comments } = photoInfo;
  const [value, setValue] = React.useState("");
  const onSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(addComment({ imageId, comment: value }));
    console.log(`value of comment`, value);
    setValue("");
    console.log(chosenPhoto);
  };
  const handleDelete = (commentId) => {
    dispatch(removeComment({ imageId, commentId }));
  };
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: -100, x: "-50%" }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, y: 100 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-2 bg-white rounded-lg overflow-hidden max-w-[400px] max-h-[70%] w-[90%] fixed bottom-[70px] left-1/2 -translate-x-1/2"
    >
      <div className="min-h-[0px] p-2 overflow-y-auto">
        {chosenPhoto != null &&
          chosenPhoto?.comments?.map((ele) => (
            <div
              key={ele._id}
              className="rounded-md p-1 flex justify-between gap-2 items-start border mb-2"
            >
              <p className="flex-auto">{ele.comment}</p>
              {ele.commentOwnerId == userId && (
                <Button color="red" onClick={() => handleDelete(ele.commentId)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </Button>
              )}
            </div>
          ))}
      </div>
      <form onSubmit={onSubmitHandler} className="flex gap-2 p-2">
        <Input
          className="bg-slate-500"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          label="comment"
          name="comment"
          type="text"
          placeholder="Comment here..."
        />
        <Button type="submit" color="green">
          submit
        </Button>
      </form>
    </motion.div>
  );
}

export default CommentBox;
