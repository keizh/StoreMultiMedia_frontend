import useAuthChecker from "../customHooks/useAuthChecker";
import NavBarComp from "../components/NavBar";
import { Outlet, useNavigate } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import useSelectorHook from "../customHooks/useSelectorHook";
import { motion } from "motion/react";
import { useEffect } from "react";
import {
  fetchOwnerAlbums,
  fetchSharedAlbums,
} from "../features/Album/albumSlice.ts";

export function AuthorizedUserPage() {
  return (
    <div className="max-w-screen-2xl min-h-screen mx-auto ">
      <NavBarComp />
      <Outlet />
    </div>
  );
}
import store from "../app/store";

const AlbumCard = ({ shared, ele }) => {
  const navigate = useNavigate();
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        opacity: 0.6,
        transition: { duration: 0.5 },
      }}
      className="cursor-pointer rounded max-w-[350px] w-[200px] h-fit text-ellipsis overflow-hidden flex-auto p-3 bg-[#eceff1] text-black"
      onClick={() => {
        if (shared) {
          navigate(`/user/auth/album/${ele.albumId}`, {
            state: false,
          });
          sessionStorage.setItem('viewerIsOwner',JSON.stringify(false));
        } else {
          navigate(`/user/auth/album/${ele.albumId}`, {
            state: true,
          });
          sessionStorage.setItem('viewerIsOwner',JSON.stringify(true));
        }
      }}
    >
      <div className="p-2 rounded bg-white mb-2">
        <p>Name : {ele.name} </p>
      </div>

      <div className="bg-black text-white p-2 rounded ">
        <p className=" truncate ">Description : {ele.description}</p>
      </div>
    </motion.div>
  );
};

function Home() {
  const { OwnerAlbums, SharedAlbums } = useSelectorHook("Album");
  useAuthChecker("/user/login", "/user/auth/photos");
  const HomePageLoaderFunction = () => {
    store.dispatch(fetchOwnerAlbums());
    store.dispatch(fetchSharedAlbums());
    return null;
  };
  useEffect(() => {
    HomePageLoaderFunction();
  }, []);
  return (
    // <div className="max-w-screen-2xl min-h-screen mx-auto ">
    //   <NavBarComp />
    <>
      <div className="mt-[100px] p-4">
        <Typography variant="h2" color="blue">
          Albums
        </Typography>
        <div className="py-3 gap-2 flex flex-wrap">
          {OwnerAlbums.length > 0 &&
            OwnerAlbums.map((ele) => (
              <AlbumCard shared={false} key={ele?._id} ele={ele} />
            ))}
          {OwnerAlbums.length == 0 && <p>Create Albums....</p>}
        </div>
      </div>
      <div className="my-[10px] p-4">
        <Typography variant="h2" color="blue">
          Shared Albums
        </Typography>
        <div className="py-3 gap-2 flex flex-wrap">
          {SharedAlbums.length > 0 &&
            SharedAlbums.map((ele) => (
              <AlbumCard shared={true} key={ele?._id} ele={ele} />
            ))}
          {SharedAlbums.length == 0 && (
            <p>No Albums Have been shared with you....</p>
          )}
        </div>
      </div>
    </>
    // </div>
  );
}

export default Home;
