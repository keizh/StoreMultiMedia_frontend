import { configureStore } from "@reduxjs/toolkit";
import AlertSlice from "../features/Alert/AlertSlice";
import UserSlice from "../features/userSignupSignin/userSSSlice";
import albumSlice from "../features/Album/albumSlice";
import PhotoSlice from "../features/Photos/PhotosSlice";
const store = configureStore({
  reducer: {
    Alert: AlertSlice.reducer,
    User: UserSlice.reducer,
    Album: albumSlice.reducer,
    Photos: PhotoSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
