import { useSelector } from "react-redux";
import { RootState } from "../app/store";

type validKeys = keyof RootState;

const useSelectorHook = (key: validKeys) =>
  useSelector((store: RootState) => store[`${key}`]);

export default useSelectorHook;
