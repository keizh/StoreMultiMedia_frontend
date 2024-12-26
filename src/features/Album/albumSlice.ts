import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Types } from "mongoose";
import { addAlert } from "../Alert/AlertSlice";
import uniqid from "uniqid";

interface AlbumInterface {
  albumId: string;
  name: string;
  description: string;
  ownerId: string | Types.ObjectId;
  sharedUsers: string[];
}

interface AlbumInterface {
  albumId: string;
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  sharedUsers: string[];
}
const initialState: initialStateInterface = {
  status: "idle",
  OwnerAlbums: [],
  SharedAlbums: [],
  error: "",
  deletedAlbum: false,
  selectedAlbumData: null,
};

interface newAlbumCreated {
  ownerId: string;
  name: string;
  description: string;
}

interface fetchAlbumsInterface {
  message: string;
  albums?: AlbumInterface[] | [];
}

interface initialStateInterface {
  status: "idle" | "loading" | "error" | "success";
  OwnerAlbums: AlbumInterface[];
  SharedAlbums: AlbumInterface[];
  error: string;
  deletedAlbum: boolean;
  selectedAlbumData: AlbumInterface | null;
}

// RESPONSIBLE FOR FETCHING OWNER CREATED ALBUMS
export const fetchOwnerAlbums = createAsyncThunk(
  "GET/ownersAlbums",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album/owner`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data: fetchAlbumsInterface = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

// RESPONSIBLE FOR FETCHING ALBUMS SHARED TO THE USER BY OTHER USERS
export const fetchSharedAlbums = createAsyncThunk(
  "GET/sharedAlbums",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album/shared`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data: fetchAlbumsInterface = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

// RESPONSIBLE FOR CREATING NEW ALBUM
export const createAlbum = createAsyncThunk(
  "POST/newAlbum",
  async (data: newAlbumCreated, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const dataRes = await res.json();
      if (!res.ok) {
        throw new Error(dataRes.message);
      }
      dispatch(createAlbumSYNC(dataRes.Album));
      console.log(dataRes.Album);
      return dataRes;
    } catch (err: unknown) {
      return rejectWithValue(err instanceof Error ? err.message : "");
    }
  }
);

// RESPONSIBLE FOR SHARE AND UPDAING
export const updateAlbum = createAsyncThunk(
  "POST/updatingAlbum",
  async (
    {
      data,
      albumId,
    }: {
      data: { sharedUsers: string[]; description: string };
      albumId: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    console.log(data, albumId);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album/${albumId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
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
      return dataRes.updatedAlbum;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to update Album"
      );
    }
  }
);

// RESPONSIBLE FOR DELETING ALBUM
export const deleteAlbum = createAsyncThunk(
  "delete/Album",
  async (albumid: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album/${albumid}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        dispatch(
          addAlert({
            message: data.message,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(data.message);
      }
      dispatch(
        addAlert({
          message: data.message,
          color: "green",
          alertId: uniqid(),
        })
      );
      return albumid;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to Delete Album"
      );
    }
  }
);

// RESPONSIBLE FOR FETCHING ALBUM DETAILS
export const fetchAlbumDetails = createAsyncThunk(
  "fetchALBUM",
  async (albumid: string, { dispatch, rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/album/details/${albumid}`,
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
            message: data.message,
            color: "red",
            alertId: uniqid(),
          })
        );
        throw new Error(data.message);
      }
      dispatch(
        addAlert({
          message: data.message,
          color: "green",
          alertId: uniqid(),
        })
      );
      return data.album;
    } catch (err: unknown) {
      return rejectWithValue(
        err instanceof Error ? err.message : "Failed to Fetch Album details"
      );
    }
  }
);

const albumSlice = createSlice({
  name: "albumSlice",
  initialState,
  reducers: {
    createAlbumSYNC: (state, action) => {
      state.OwnerAlbums.push(action.payload);
    },
    setDeletedAlbumFalse: (state) => {
      state.deletedAlbum = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwnerAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchOwnerAlbums.fulfilled,
        (state, action: PayloadAction<fetchAlbumsInterface>) => {
          state.status = "success";
          state.OwnerAlbums = action?.payload?.albums || [];
        }
      )
      .addCase(
        fetchOwnerAlbums.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
        }
      );

    builder
      .addCase(fetchSharedAlbums.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchSharedAlbums.fulfilled,
        (state, action: PayloadAction<fetchAlbumsInterface>) => {
          state.status = "success";
          state.SharedAlbums = action?.payload?.albums || [];
        }
      )
      .addCase(
        fetchSharedAlbums.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
        }
      );

    builder
      .addCase(createAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createAlbum.fulfilled, (state) => {
        state.status = "success";
      })
      .addCase(
        createAlbum.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
        }
      );

    builder
      .addCase(deleteAlbum.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteAlbum.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "success";
          state.deletedAlbum = true;
          console.log(`inside deleteAlbum `);
          state.OwnerAlbums = state.OwnerAlbums.filter(
            (ele) => ele.albumId != action.payload
          );
        }
      )
      .addCase(
        deleteAlbum.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
        }
      );

    builder
      .addCase(fetchAlbumDetails.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchAlbumDetails.fulfilled,
        (state, action: PayloadAction<AlbumInterface>) => {
          state.status = "success";
          state.selectedAlbumData = action.payload;
        }
      )
      .addCase(
        fetchAlbumDetails.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
        }
      );

    builder
      .addCase(updateAlbum.pending, (state) => {
        state.status = "loading";
        console.log(`LINE 348`);
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.status = "success";
        console.log(`LINE 352`);
        state.selectedAlbumData = action.payload;
      })
      .addCase(
        updateAlbum.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.status = "error";
          state.error = action.payload || "An Error Occured";
          console.log(`LINE 359`);
        }
      );
  },
});

export default albumSlice;
export const { createAlbumSYNC, setDeletedAlbumFalse } = albumSlice.actions;
