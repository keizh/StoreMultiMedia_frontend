import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";

const useDispatchHook = () => useDispatch<AppDispatch>();

export default useDispatchHook;
