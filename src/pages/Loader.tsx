import { Button } from "@material-tailwind/react";
import useAuthChecker from "../customHooks/useAuthChecker";

function Loader() {
  useAuthChecker("/user/login", "/user/auth/photos");
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Button disabled={true} size="lg" loading={true}>
        Welcome
      </Button>
    </div>
  );
}

export default Loader;
