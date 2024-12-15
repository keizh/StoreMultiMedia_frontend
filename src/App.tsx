import { Routes, Route, Outlet, useSearchParams } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import AlertSystem from "./components/AlertSystem";
import Loader from "./pages/Loader";
import Home from "./pages/Home";
import { useEffect } from "react";
import useDispatchHook from "./customHooks/useDispatchHook";
import { addAlert } from "./features/Alert/AlertSlice";
import uniqid from "uniqid";
import useSelectorHook from "./customHooks/useSelectorHook";

const PageDefault = () => {
  const dispatch = useDispatchHook();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
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
  }, [searchParams]);

  return (
    <div>
      <AlertSystem />
      <Outlet />
    </div>
  );
};

const NotFound = () => {
  return <div className="h-screen w-screen ">not found</div>;
};

export default function App() {
  return (
    <div>
      <Routes>
        {/* outlet does cause a bit of navigation difficulties */}
        <Route path="/" element={<Loader />} />
        <Route path="/user" element={<PageDefault />}>
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="photos" element={<Home />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
