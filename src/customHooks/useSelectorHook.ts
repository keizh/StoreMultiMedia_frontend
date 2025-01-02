import { useSelector } from "react-redux";
import { RootState } from "../app/store";

type ValidKeys = keyof RootState;

const useSelectorHook = <T extends ValidKeys>(key: T): RootState[T] => {
  return useSelector((store: RootState) => store[key]);
};

export default useSelectorHook;
