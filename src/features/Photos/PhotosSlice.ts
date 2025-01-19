import uniqid from "uniqid";

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Types } from "mongoose";
import { addAlert } from "../Alert/AlertSlice";

export type commentOBJ = {
  comment: string;
  commentOwnerId: Types.ObjectId | string;
  commentId?: string;
  _id?: string;
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
  _id?: string;
}

interface initialStateInterface {
  filteredPhotosArr: ImageInterface[];
  PhotosArr: ImageInterface[];
  tags: string[];
  status: "idle" | "error" | "success" | "loading";
  error: string | null;
  chosenPhoto: null | ImageInterface;
}

const initialState: initialStateInterface = {
  filteredPhotosArr: [],
  PhotosArr: [],
  tags: [],
  status: "idle",
  chosenPhoto: null,
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

export const addComment = createAsyncThunk(
  "POST/Comment",
  async (
    data: { imageId: string; comment: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const commentId = uniqid();
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/image/comment/add`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, commentId }),
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        dispatch(
          addAlert({
            message: `failed to add comment`,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(resData.message);
      }
      dispatch(
        addAlert({
          message: `Comment added`,
          color: "green",
          alertId: uniqid(),
        })
      );

      return { comment_OBJ: resData.comment_OBJ, imageId: data.imageId };
    } catch (err: unknown) {
      const mssg = err instanceof Error ? err.message : "Failed to add message";
      rejectWithValue({ mssg });
    }
  }
);

export const removeComment = createAsyncThunk(
  "DELETE/Comment",
  async (
    data: { imageId: string; commentId: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/image/comment/remove`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...data, commentId: data.commentId }),
        }
      );
      const resData = await res.json();
      if (!res.ok) {
        dispatch(
          addAlert({
            message: `failed to delete comment`,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(resData.message);
      }
      dispatch(
        addAlert({
          message: `successfully deleted Comment`,
          color: "green",
          alertId: uniqid(),
        })
      );

      return data.commentId;
    } catch (err: unknown) {
      const mssg =
        err instanceof Error ? err.message : "Failed to removed comment";
      rejectWithValue({ mssg });
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
  async (imageId: string, { dispatch, rejectWithValue }) => {
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

export const makeImgFavorite = createAsyncThunk(
  "POST/isFavoriteTrue",
  async ({ imgId }: { imgId: string }, { dispatch, rejectWithValue }) => {
    console.log(`----------event sent to like image-----------`);
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/v1/image/markFavorite/${imgId}`,
        {
          method: "POST",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const resData = await res.json();
      console.log(res);
      console.log(resData);

      if (!res.ok) {
        dispatch(
          addAlert({
            message: `${resData.message}`,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(resData.message);
      }

      dispatch(
        addAlert({
          message: `Image Liked`,
          color: "green",
          alertId: uniqid(),
        })
      );

      return imgId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const makeImgUnFavorite = createAsyncThunk(
  "POST/isFavoriteFalse",
  async ({ imgId }: { imgId: string }, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URI
        }/api/v1/image/markUnFavorite/${imgId}`,
        {
          method: "POST",
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
          message: `${dataRes.message}`,
          color: "green",
          alertId: uniqid(),
        })
      );

      return imgId;
    } catch (err) {
      return rejectWithValue(err.message);
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
    chosenPhotoReducer: (state, action) => {
      state.chosenPhoto = action.payload;
    },
    filteredPhotosArrFB: (state, action) => {
      console.log(`executing filtering search ${action.payload}`);
      state.filteredPhotosArr = state.PhotosArr.filter((ele) => {
        return ele.name.toLowerCase().includes(action.payload.toLowerCase());
      });
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
          state.tags = Array.from(
            new Set(["All Images", ...action.payload.tags])
          );
          console.log(`Photos fetched`, action.payload.images);
        }
      )
      .addCase(
        getPhotos.rejected,
        (
          state,
          action: ReturnType<typeof getPhotos.rejected> & { payload: string }
        ) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    // action: PayloadAction<{
    //   savedImages: ImageInterface[];
    //   tags: string;
    // }

    builder
      .addCase(postPhotos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        postPhotos.fulfilled,
        (
          state,
          action: ReturnType<typeof postPhotos.fulfilled> & {
            payload: {
              message: string;
              tags: string[];
            };
          }
        ) => {
          console.log(action.payload);
          state.status = "success";
          state.PhotosArr = [...state.PhotosArr, ...action.payload.savedImages];
          state.tags = Array.from(
            new Set([...state.tags, ...action.payload.tags])
          );
        }
      )
      .addCase(
        postPhotos.rejected,
        (
          state,
          action: ReturnType<typeof postPhotos.rejected> & { payload: string }
        ) => {
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
        (
          state,
          action: ReturnType<typeof deletePhoto.rejected> & { payload: string }
        ) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    builder
      .addCase(addComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        addComment.fulfilled,
        (
          state,
          action: PayloadAction<{
            imageId: string;
            comment_OBJ: {
              comment: string;
              commentOwnerId: string;
              commentId: string;
            };
          }>
        ) => {
          state.status = "success";
          state.PhotosArr = state.PhotosArr.map((ele) => {
            if (ele.imageId != action.payload.imageId) {
              return ele;
            }
            ele?.comments?.push(action.payload.comment_OBJ);
            return ele;
          });
          state.chosenPhoto.comments.push(action.payload.comment_OBJ);
        }
      )
      .addCase(
        addComment.rejected,
        (
          state,
          action: ReturnType<typeof addComment.rejected> & { payload: string }
        ) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    builder
      .addCase(removeComment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        removeComment.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "success";

          state.chosenPhoto = {
            ...state.chosenPhoto,
            comments: state.chosenPhoto.comments.filter(
              (ele) => ele.commentId != action.payload
            ),
          };
          console.log(action.payload);
          console.log(`implemented line 409`);
        }
      )
      .addCase(
        removeComment.rejected,
        (
          state,
          action: ReturnType<typeof removeComment.rejected> & {
            payload: string;
          }
        ) => {
          state.status = "error";
          state.error = action.payload || "Error occured while fetching Photos";
        }
      );

    builder
      .addCase(makeImgFavorite.pending, () => {})
      .addCase(makeImgFavorite.fulfilled, (state, action) => {
        const imgId = action.payload;
        state.PhotosArr = state.PhotosArr.map((ele) => {
          if (ele._id == imgId) {
            ele.isFavorite = true;
          }

          return ele;
        });
      })
      .addCase(makeImgFavorite.rejected, (_, action) => {
        console.log(action.payload);
      });

    builder
      .addCase(makeImgUnFavorite.pending, () => {})
      .addCase(makeImgUnFavorite.fulfilled, (state, action) => {
        const imgId = action.payload;
        state.PhotosArr = state.PhotosArr.map((ele) => {
          if (ele._id == imgId) {
            ele.isFavorite = false;
          }
          return ele;
        });
      })
      .addCase(makeImgUnFavorite.rejected, (_, action) => {
        console.log(action.payload);
      });
  },
});

export const { emptyPhotos, filteredPhotosArrFB, chosenPhotoReducer } =
  PhotoSlice.actions;
export default PhotoSlice;
