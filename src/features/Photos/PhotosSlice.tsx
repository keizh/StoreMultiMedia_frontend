import uniqid from "uniqid";

import {
  createSlice,
  createAsyncThunk,
  UnknownAction,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Types } from "mongoose";
import { addAlert } from "../Alert/AlertSlice";

export type commentOBJ = {
  comment: string;
  commentOwnerId: Types.ObjectId | string;
  commentId?: string;
};

export interface ImageInterface {
  imageId: string;
  imgURL: string;
  public_id: string;
  imgOwnerId: string;
  albumId: string;
  name?: string;
  tags?: string[];
  person?: string;
  isFavorite?: boolean;
  comments?: commentOBJ[];
  size: string;
}

interface initialStateInterface {
  PhotosArr: ImageInterface[] | [];
  tags: string[] | [];
  status: "idle" | "error" | "success" | "loading";
  error: string | null;
}

const initialState: initialStateInterface = {
  PhotosArr: [],
  tags: [],
  status: "idle",
  error: null,
};

export const getPhotos = createAsyncThunk(
  "GET/photos",
  async (albumId: string, { rejectWithValue, dispatch }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/image/${albumId}`,
        {
          method: "GET",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(
          addAlert({
            message: `Failed to Fetch Images`,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(data.message);
      }
      return data;
    } catch (err: unknown) {
      const mssg =
        err instanceof Error
          ? err.message
          : "Err occured while fetching Photos";
      return rejectWithValue(mssg);
    }
  }
);

interface PhotoResponse {
  message: string;
  savedImages?: ImageInterface[];
}

export const postPhotos = createAsyncThunk<
  PhotoResponse,
  FormData,
  {
    rejectValue: string | null;
  }
>("POST/photos", async (data, { rejectWithValue, dispatch }) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URI}/api/v1/image/imgs`,
      {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: data,
      }
    );

    const dataRes = await res.json();
    if (!res.ok) {
      dispatch(
        addAlert({
          message: `Failed to upload`,
          color: "red",
          alertId: uniqid(),
        })
      );
      throw new Error(dataRes.message);
    }
    dispatch(
      addAlert({
        message: `Images uploaded`,
        color: "green",
        alertId: uniqid(),
      })
    );
    return dataRes;
  } catch (err: unknown) {
    const mssg =
      err instanceof Error ? err.message : "Err occured while fetching Photos";
    return rejectWithValue(mssg);
  }
});

export const deletePhoto = createAsyncThunk(
  "DELETE/IMAGE",
  async (imageId, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/image/delete/${imageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );

      const dataRes = await res.json();
      if (!res.ok) {
        dispatch(
          addAlert({
            message: `${dataRes.message}`,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(dataRes.message);
      }
      dispatch(
        addAlert({
          message: `Image successfully deleted`,
          color: "green",
          alertId: uniqid(),
        })
      );
      return imageId;
    } catch (err) {
      const mssg =
        err instanceof Error ? err.message : "Err occured while deleting image";
      return rejectWithValue(mssg);
    }
  }
);

const PhotoSlice = createSlice({
  name: "PhotoSlice",
  initialState,
  reducers: {
    emptyPhotos: (state) => {
      state.PhotosArr = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPhotos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getPhotos.fulfilled,
        (
          state,
          action: PayloadAction<{
            images: ImageInterface[] | [];
            tags: string[] | [];
          }>
        ) => {
          state.status = "success";
          state.PhotosArr = action.payload.images;
          state.tags = action.payload.tags;
          console.log(`Photos fetched`, action.payload.images);
        }
      )
      .addCase(
        getPhotos.rejected,
        (state, action: PayloadAction<string | null>) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    builder
      .addCase(postPhotos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postPhotos.fulfilled,
        (
          state,
          action: PayloadAction<{
            savedImages: ImageInterface[];
            tags: string;
          }>
        ) => {
          console.log(action.payload);
          state.status = "success";
          state.PhotosArr = [...state.PhotosArr, ...action.payload.savedImages];
          state.tags = [...state.tags, action.payload.tags];
        }
      )
      .addCase(
        postPhotos.rejected,
        (state, action: PayloadAction<string | null>) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    builder
      .addCase(deletePhoto.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deletePhoto.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "success";
          state.PhotosArr = state.PhotosArr.filter(
            (ele) => ele.imageId != action.payload
          );
        }
      )
      .addCase(
        deletePhoto.rejected,
        (state, action: PayloadAction<string | null>) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );
  },
});

export const { emptyPhotos } = PhotoSlice.actions;
export default PhotoSlice;
