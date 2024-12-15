import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AlertType {
  alertId: string | number;
  message: string;
  color: "red" | "green";
}

interface AlertArrayInterface {
  alertArray: AlertType[];
}

const initialState: AlertArrayInterface = {
  alertArray: [],
};

const AlertSlice = createSlice({
  name: "createSlice",
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<AlertType>) => {
      state.alertArray.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<{ id: string | number }>) => {
      state.alertArray = state.alertArray.filter(
        (ele) => ele.alertId !== action.payload.id
      );
    },
  },
});

export const { removeAlert, addAlert } = AlertSlice.actions;
export default AlertSlice;
