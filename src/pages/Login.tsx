import { useState, useEffect, ReactElement } from "react";
import {
  Card,
  Input,
  Button,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { postUserLogin } from "../features/userSignupSignin/userSSSlice";
import useDispatchHook from "../customHooks/useDispatchHook";
import useSelectorHook from "../customHooks/useSelectorHook";
import { z } from "zod";
import { NavLink, useNavigate } from "react-router-dom";
import tokenAuth from "../utils/auth";

function IconSolid(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
        clipRule="evenodd"
      />
    </svg>
  );
}

interface loginCredentialsInterface {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatchHook();
  const { userId } = useSelectorHook("User");
  const initialData: loginCredentialsInterface = {
    email: "",
    password: "",
  };

  const [data, setData] = useState<loginCredentialsInterface>(initialData);
  const [canClick, setCanClick] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string; value: string } = e.target;
    setData((data) => ({ ...data, [name]: value }));
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(postUserLogin(data));
  };

  useEffect(() => {
    if (data.name != "" && data.email != "" && data.password != "") {
      setCanClick(true);
    } else {
      setCanClick(false);
    }
  }, [data]);

  useEffect(() => {
    if (userId != "") {
      setLoadingState(true);
      setTimeout(() => {
        setLoadingState(false);
        navigate("/user/photos");
      }, 2000);
    }
  }, [userId]);

  useEffect(() => {
    if (tokenAuth()) {
      navigate("/user/photos");
      console.log("/photos");
    }
  }, [navigate]);

  return (
    <div className="min-h-[100vh] overflow-y-auto overflow-x-hidden w-full flex justify-center items-center">
      <div className="max-w-[90%] sm:w-[400px]">
        <Typography align="center" variant="h4" color="blue-gray">
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
