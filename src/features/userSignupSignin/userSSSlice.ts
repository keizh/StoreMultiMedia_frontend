import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
// import store from "../../app/store";
import uniqid from "uniqid";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { addAlert } from "../Alert/AlertSlice";

interface userListInterface {
  email: string;
  userId: string;
  exp: number;
}

interface userInterface {
  email: string;
  userId: string;
  userList: userListInterface[];
  status: "idle" | "loading" | "error" | "success";
  error: string;
  exp: number;
}

interface customJwtPayload extends JwtPayload {
  email: string;
  userId: string;
  exp: number;
}

const initialState: userInterface = {
  email: "",
  userId: "",
  status: "idle",
  userList: [],
  error: "",
  exp: 0,
};

export const postCreateNewUser = createAsyncThunk<
  { message: string },
  { user: string; email: string; userId: string },
  { rejectValue: string }
>("UserSlice/postCreateNewUser", async (obj, { dispatch, rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/signup`,
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const dataRes = await res.json();

    if (!res.ok) {
      throw new Error(dataRes.message);
    }
    dispatch(
      addAlert({
        message: dataRes.message,
        color: "green",
        alertId: uniqid(),
      })
    );
    return dataRes; // Pass the successful response to the fulfilled case
  } catch (err: unknown) {
    const mssg = err instanceof Error ? err.message : "unknown Error";

    dispatch(
      addAlert({
        message: mssg,
        color: "red",
        alertId: uniqid(),
      })
    );
    return rejectWithValue(mssg);
  }
});

export const postUserLogin = createAsyncThunk<
  { message: string; token?: string },
  { email: string; password: string },
  { rejectValue: string }
>("POST/userLogin", async (obj, { dispatch, rejectWithValue }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/login`,
      {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const dataRes = await res.json();

    if (!res.ok) {
      throw new Error(dataRes.message);
    }
    dispatch(
      addAlert({ message: dataRes.message, color: "green", alertId: uniqid() })
    );
    return dataRes;
  } catch (err: unknown) {
    const mssg = err instanceof Error ? err.message : "unknown error";
    dispatch(addAlert({ message: mssg, color: "red", alertId: uniqid() }));
    return rejectWithValue(mssg);
  }
});

export const fetchUserList = createAsyncThunk(
  "fetch/userList",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/auth/fetch/users`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      const dataRes = await res.json();

      if (!res.ok) {
        throw new Error(dataRes.message);
      }
      dispatch(
        addAlert({
          message: dataRes.message,
          color: "green",
          alertId: uniqid(),
        })
      );
      return dataRes.userList;
    } catch (err: unknown) {
      const mssg = err instanceof Error ? err.message : "unknown error";
      dispatch(addAlert({ message: mssg, color: "red", alertId: uniqid() }));
      return rejectWithValue(mssg);
    }
  }
);

// Redux slice
const UserSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUserLoginCredential: (
      state,
      action: PayloadAction<{ userId: string; email: string }>
    ) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    removeUserLoginCredential: (state) => {
      state.userId = "";
      state.email = "";
      state.exp = 0;
      localStorage.removeItem("token");
    },
  },
  // wont be using the below code , but cannot comment why not ? THE ALL POWERFULL TYPESCRIPT WILL GET ANGRY
  extraReducers: (builder) => {
    builder
      .addCase(postCreateNewUser.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(postCreateNewUser.fulfilled, (state) => {
        state.status = "success";
        state.error = "";
      })
      .addCase(
        postCreateNewUser.rejected,
        (
          state,
          action: ReturnType<typeof postCreateNewUser.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error =
            action.payload || action.error?.message || "An error occurred";
        }
      );

    builder
      .addCase(fetchUserList.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(fetchUserList.fulfilled, (state, action) => {
        state.status = "success";
        state.userList = action.payload;
      })
      .addCase(
        fetchUserList.rejected,
        (
          state,
          action: ReturnType<typeof fetchUserList.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error =
            action.payload || action.error?.message || "An error occurred";
        }
      );

    builder
      .addCase(postUserLogin.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(postUserLogin.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        localStorage.setItem("token", action.payload.token);
        try {
          const {
            email,
            userId,
            exp,
          }: {
            email: string;
            userId: string;
            exp: number;
          } = jwtDecode<customJwtPayload>(action.payload.token);
          state.email = email;
          state.userId = userId;
          state.exp = exp;
        } catch (err: unknown) {
          const mssg: string =
            err instanceof Error ? err.message : "An error occurred";
          state.error = mssg;
        }
      })
      .addCase(
        postUserLogin.rejected,
        (
          state,
          action: ReturnType<typeof postUserLogin.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error =
            action.payload || action.error?.message || "An error occurred";
        }
      );
  },
});

export const { setUserLoginCredential, removeUserLoginCredential } =
  UserSlice.actions;
export default UserSlice;
