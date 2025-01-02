import { useState } from "react";
import { Input, Button, Typography } from "@material-tailwind/react";
import { postUserLogin } from "../features/userSignupSignin/userSSSlice";
import useDispatchHook from "../customHooks/useDispatchHook";
import { NavLink } from "react-router-dom";
import useAuthChecker from "../customHooks/useAuthChecker";

interface loginCredentialsInterface {
  email: string;
  password: string;
}

export function Login() {
  useAuthChecker("/user/login", "/user/auth/photos");
  const dispatch = useDispatchHook();
  const initialData: loginCredentialsInterface = {
    email: "",
    password: "",
  };

  const [data, setData] = useState<loginCredentialsInterface>(initialData);
  const [canClick] = useState<boolean>(false);
  const [loadingState] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string; value: string } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postUserLogin(data));
  };

  // useEffect(() => {
  //   if (data.name != "" && data.email != "" && data.password != "") {
  //     setCanClick(true);
  //   } else {
  //     setCanClick(false);
  //   }
  // }, [data]);

  // useEffect(() => {
  //   if (userId != "") {
  //     setLoadingState(true);
  //     setTimeout(() => {
  //       setLoadingState(false);
  //       navigate("/user/photos");
  //     }, 2000);
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   if (tokenAuth()) {
  //     navigate("/user/photos");
  //     console.log("/photos");
  //   }
  // }, [navigate]);

  return (
    <div className="min-h-[100vh] overflow-y-auto overflow-x-hidden w-full flex justify-center items-center">
      <div className="max-w-[90%] sm:w-[400px]">
        <Typography className="text-center" variant="h4" color="blue-gray">
          Login to KoviasPix
        </Typography>
        <form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (canClick) {
              submitHandler(e);
            }
          }}
          className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96"
        >
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Your Email
            </Typography>
            <Input
              crossOrigin={undefined}
              disabled
              name="email"
              onChange={handleChange}
              size="lg"
              placeholder="HrithikRoshan@mail.com"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="h6" color="blue-gray" className="-mb-3">
              Password
            </Typography>

            <Input
              crossOrigin={undefined}
              disabled
              name="password"
              onChange={handleChange}
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
          </div>

          <Button
            disabled
            loading={loadingState}
            type="submit"
            color={canClick ? "green" : "red"}
            className="mt-6 flex justify-center items-center"
            fullWidth
          >
            Login
          </Button>
          <Typography color="gray" className="mt-4 text-center font-normal">
            Don't have an account?{" "}
            <NavLink to="/user/signup" className="font-medium text-gray-900">
              Sign up
            </NavLink>
          </Typography>
          <div className="flex my-4 items-center gap-2">
            <div className="border h-[0px] flex-auto border-black"></div>
            <Typography className="font-bold">OR</Typography>
            <div className="border h-[0px] flex-auto border-black"></div>
          </div>
          <Button
            size="lg"
            variant="outlined"
            color="blue-gray"
            className="flex justify-center items-center gap-3"
            fullWidth
            onClick={() =>
              (window.location.href = `${
                import.meta.env.VITE_BACKEND_URI
              }/api/v1/auth/google/oauth`)
            }
          >
            <img
              src="https://docs.material-tailwind.com/icons/google.svg"
              alt="metamask"
              className="h-6 w-6"
            />
            Continue with Google
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
