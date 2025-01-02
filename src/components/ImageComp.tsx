import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ButtonGroupComp from "./ButtonGroupComp";
import CommentBox from "./CommentBox";
import { AnimatePresence } from "framer-motion";
function ImageComp() {
  const location = useLocation();
  const navigate = useNavigate();
  // const { photoInfo, viewerIsOwner } = location.state;
  const { photoInfo } = location.state;
  const [open, setOpen] = useState(false);
  return (
    <div className="h-screen w-screen bg-black relative overflow-hidden">
      <button
        className="absolute z-[1000] text-[10px] top-[10px] right-[10px] bg-white p-2 rounded-xl flex gap-2 items-center"
        onClick={() => navigate(-1)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-3 sm:size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>{" "}
        MOVE BACK
      </button>
      <img
        src={photoInfo.imgURL}
        className="absolute top-[50%] left-[50%] -translate-x-2/4 -translate-y-2/4 object-contain"
      />
      <ButtonGroupComp
        imageId={photoInfo.imageId}
        imgOwnerId={photoInfo.imgOwnerId}
        setOpen={setOpen}
        src={photoInfo.imgURL}
      />
      <AnimatePresence>
        {open && <CommentBox imageId={photoInfo.imageId} />}
      </AnimatePresence>
    </div>
  );
}

export default ImageComp;
