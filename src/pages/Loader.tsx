import { Button } from "@material-tailwind/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tokenAuth from "../utils/auth";

function Loader() {
  const navigate = useNavigate();
  useEffect(() => {
    if (tokenAuth()) {
      navigate("/user/photos", { replace: true });
      console.log("/user/photos");
    } else {
      navigate("/user/login", { replace: true });
      console.log("/user/login");
    }
  }, [navigate]);
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Button disabled={true} size="lg" loading={true}>
        Welcome
      </Button>
    </div>
  );
}

export default Loader;
