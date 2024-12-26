import { Outlet, useSearchParams } from "react-router-dom";

import AlertSystem from "./components/AlertSystem";

import { useEffect, useLayoutEffect } from "react";
import useDispatchHook from "./customHooks/useDispatchHook";
import { addAlert } from "./features/Alert/AlertSlice";
import uniqid from "uniqid";

export const PageDefault = () => {
  const dispatch = useDispatchHook();
  const [searchParams, setSearchParams] = useSearchParams();
  // will continue observing the searchParams
  useLayoutEffect(() => {
    const token = searchParams.get("token");
    const issue = searchParams.get("issue");
    if (token) {
      localStorage.setItem(`token`, token);
      dispatch(
        addAlert({
          alertId: uniqid(),
          message: "Google Sign successfull",
          color: "green",
        })
      );
    }
    if (issue) {
      dispatch(addAlert({ alertId: uniqid(), message: issue, color: "red" }));
    }
    setSearchParams({});
  }, [dispatch, searchParams, setSearchParams]);

  return (
    <div className=" bg-slate-50 w-full h-fit overflow-y-auto overflow-x-hidden">
      <AlertSystem />
      <Outlet />
    </div>
  );
};

export const NotFound = () => {
  return <div className="h-screen w-screen ">not found</div>;
};

export default function App() {
  return <div>App Component</div>;
}
