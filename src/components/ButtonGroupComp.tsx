import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@material-tailwind/react";

import useDispatchHook from "../customHooks/useDispatchHook";
import { deletePhoto } from "../features/Photos/PhotosSlice";
function ButtonGroupComp({ setOpen, imageId, src, viewerIsOwner, albumid }) {
  // const location=useLocation();
  // const {viewerIsOwner}=location.state;
  const navigate = useNavigate();
  const dispatch = useDispatchHook();
  const [loading, setLoading] = React.useState(false);
  // const { userId } = useSelectorHook("User");

  const handleDelete = async () => {
    setLoading(true);
    await dispatch(deletePhoto(imageId));
    // sessionStorage.removeItem('imgDisplayData');
    navigate(`/user/auth/album/${albumid}`);
  };

  const handleDownload = async () => {
    fetch(src)
      .then((res) => res.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "image.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      });
  };

  return (
    <div className="fixed flex gap-2 bottom-3 left-1/2 -translate-x-1/2 ">
      <Button onClick={handleDownload} color="yellow">
        download
      </Button>
      <Button onClick={() => setOpen((open) => !open)} color="blue">
        Comment
      </Button>
      {viewerIsOwner && (
        <Button loading={loading} onClick={handleDelete} color="red">
          Delete
        </Button>
      )}
    </div>
  );
}

export default ButtonGroupComp;
