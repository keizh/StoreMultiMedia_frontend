import { configureStore } from "@reduxjs/toolkit";
import AlertSlice from "../features/Alert/AlertSlice";
import UserSlice from "../features/userSignupSignin/userSSSlice";

const store = configureStore({
  reducer: {
    Alert: AlertSlice.reducer,
    User: UserSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
