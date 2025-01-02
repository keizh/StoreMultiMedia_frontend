// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PageDefault, NotFound } from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store.ts";
import Loader from "./pages/Loader.tsx";
import SignUp from "./pages/Signup.tsx";
import Login from "./pages/Login.tsx";
import Home, { AuthorizedUserPage } from "./pages/Home.tsx";
import { getPhotos } from "./features/Photos/PhotosSlice.ts";
import { fetchAlbumDetails } from "./features/Album/albumSlice.ts";
import { fetchUserList } from "./features/userSignupSignin/userSSSlice.ts";
import Album from "./components/Album.tsx";
import ImageComp from "./components/ImageComp.tsx";

const AlbumPhotosCompfetchPhotos = ({ params }) => {
  const { albumid } = params;
  store.dispatch(getPhotos(albumid));
  store.dispatch(fetchAlbumDetails(albumid));
  store.dispatch(fetchUserList());
  console.log(`played`);
  return null;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Loader />,
    errorElement: <NotFound />,
  },
  {
    path: "/user",
    element: <PageDefault />,
    errorElement: <NotFound />,
    children: [
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "image",
        element: <ImageComp />,
      },
      {
        path: "auth",
        element: <AuthorizedUserPage />,
        errorElement: <NotFound />,
        children: [
          {
            path: "photos",
            element: <Home />,
            // loader: HomePageLoaderFunction,
          },
          {
            path: "album/:albumid",
            element: <Album />,
            loader: AlbumPhotosCompfetchPhotos,
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
